/**
 * Targeted cleanup: remove known inactive duplicate products and unused Sun Care category.
 * Does NOT reseed. Does NOT delete image files. Does NOT touch active products.
 *
 * Usage:
 *   pnpm dlx tsx prisma/cleanup-inactive-duplicates.ts --inspect
 *   pnpm dlx tsx prisma/cleanup-inactive-duplicates.ts --apply
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const TARGET_PRODUCT_SLUGS = [
  'radiance-face-wash',
  'vitamin-c-brightening-serum',
  'hydrating-ceramide-moisturizer',
  'daily-defense-sunscreen',
] as const;

const TARGET_CATEGORY_SLUGS = ['sun-care'] as const;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

const apply = process.argv.includes('--apply');

type ProductDeps = {
  images: number;
  cartItems: number;
  wishlistItems: number;
  orderItems: number;
};

async function getProductDeps(productId: string): Promise<ProductDeps> {
  const [images, cartItems, wishlistItems, orderItems] = await Promise.all([
    prisma.productImage.count({ where: { productId } }),
    prisma.cartItem.count({ where: { productId } }),
    prisma.wishlistItem.count({ where: { productId } }),
    prisma.orderItem.count({ where: { productId } }),
  ]);
  return { images, cartItems, wishlistItems, orderItems };
}

async function main() {
  const mode = apply ? 'APPLY' : 'INSPECT';
  console.info(`\n=== Catalog cleanup (${mode}) ===\n`);

  const activeBefore = await prisma.product.count({ where: { isActive: true } });
  const totalBefore = await prisma.product.count();
  console.info(`Active products before: ${activeBefore}`);
  console.info(`Total products before:  ${totalBefore}\n`);

  console.info('--- Products ---');
  const removableProductIds: string[] = [];
  const blocked: Array<{ slug: string; reason: string }> = [];

  for (const slug of TARGET_PRODUCT_SLUGS) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!product) {
      console.info(`[${slug}] NOT FOUND — nothing to remove`);
      continue;
    }

    const deps = await getProductDeps(product.id);
    const summary = {
      id: product.id,
      name: product.name,
      isActive: product.isActive,
      category: `${product.category.name} (${product.category.slug})`,
      deps,
    };
    console.info(`[${slug}]`, JSON.stringify(summary, null, 2));

    if (product.isActive) {
      blocked.push({ slug, reason: 'Product is ACTIVE — refuse deletion' });
      continue;
    }

    if (deps.cartItems > 0 || deps.wishlistItems > 0 || deps.orderItems > 0) {
      blocked.push({
        slug,
        reason: `Has relations (cart=${deps.cartItems}, wishlist=${deps.wishlistItems}, orders=${deps.orderItems})`,
      });
      continue;
    }

    removableProductIds.push(product.id);
  }

  console.info('\n--- Categories ---');
  const removableCategoryIds: string[] = [];

  for (const slug of TARGET_CATEGORY_SLUGS) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          select: { id: true, slug: true, name: true, isActive: true },
        },
      },
    });

    if (!category) {
      console.info(`[${slug}] NOT FOUND — nothing to remove`);
      continue;
    }

    const activeInCategory = category.products.filter((p) => p.isActive);
    const inactiveInCategory = category.products.filter((p) => !p.isActive);
    console.info(
      `[${slug}]`,
      JSON.stringify(
        {
          id: category.id,
          name: category.name,
          productCount: category.products.length,
          activeCount: activeInCategory.length,
          inactiveProducts: inactiveInCategory.map((p) => p.slug),
          activeProducts: activeInCategory.map((p) => p.slug),
        },
        null,
        2,
      ),
    );

    if (activeInCategory.length > 0) {
      blocked.push({
        slug: `category:${slug}`,
        reason: `Has ${activeInCategory.length} active product(s)`,
      });
      continue;
    }

    // Category may still reference inactive products we plan to delete, or leftover
    // inactive products we must not leave orphaned without handling.
    const leftoverInactive = inactiveInCategory.filter(
      (p) => !TARGET_PRODUCT_SLUGS.includes(p.slug as (typeof TARGET_PRODUCT_SLUGS)[number]),
    );
    if (leftoverInactive.length > 0) {
      blocked.push({
        slug: `category:${slug}`,
        reason: `Has inactive products not in cleanup list: ${leftoverInactive.map((p) => p.slug).join(', ')}`,
      });
      continue;
    }

    removableCategoryIds.push(category.id);
  }

  if (blocked.length > 0) {
    console.info('\n--- Blocked ---');
    for (const b of blocked) {
      console.info(`BLOCKED ${b.slug}: ${b.reason}`);
    }
  }

  if (!apply) {
    console.info('\nInspect only. Re-run with --apply to delete removable records.');
    console.info(
      `Would remove products: ${removableProductIds.length}, categories: ${removableCategoryIds.length}`,
    );
    return;
  }

  if (blocked.length > 0) {
    throw new Error('Cleanup aborted: one or more targets are blocked by dependencies or active status.');
  }

  console.info('\n--- Applying deletions ---');

  await prisma.$transaction(async (tx) => {
    if (removableProductIds.length > 0) {
      // ProductImage cascades; cart/wishlist/order were already verified empty.
      const deletedImages = await tx.productImage.deleteMany({
        where: { productId: { in: removableProductIds } },
      });
      console.info(`Deleted product image rows: ${deletedImages.count} (DB rows only, not PNG files)`);

      const deletedProducts = await tx.product.deleteMany({
        where: { id: { in: removableProductIds } },
      });
      console.info(`Deleted products: ${deletedProducts.count}`);
    }

    if (removableCategoryIds.length > 0) {
      const deletedCategories = await tx.category.deleteMany({
        where: { id: { in: removableCategoryIds } },
      });
      console.info(`Deleted categories: ${deletedCategories.count}`);
    }
  });

  const activeAfter = await prisma.product.count({ where: { isActive: true } });
  const totalAfter = await prisma.product.count();
  const categoriesAfter = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: {
      name: true,
      slug: true,
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });

  console.info(`\nActive products after: ${activeAfter}`);
  console.info(`Total products after:  ${totalAfter}`);
  console.info('Active categories after:');
  for (const c of categoriesAfter) {
    console.info(`  - ${c.name} (${c.slug}): ${c._count.products} active`);
  }

  if (activeAfter !== 38) {
    throw new Error(`Expected 38 active products after cleanup, found ${activeAfter}`);
  }

  const missingTargets = [];
  for (const slug of TARGET_PRODUCT_SLUGS) {
    const stillThere = await prisma.product.findUnique({ where: { slug } });
    if (stillThere) missingTargets.push(slug);
  }
  for (const slug of TARGET_CATEGORY_SLUGS) {
    const stillThere = await prisma.category.findUnique({ where: { slug } });
    if (stillThere) missingTargets.push(`category:${slug}`);
  }
  if (missingTargets.length > 0) {
    throw new Error(`Cleanup incomplete; still present: ${missingTargets.join(', ')}`);
  }

  console.info('\nCleanup applied successfully.');
}

main()
  .catch((error: unknown) => {
    console.error('Cleanup failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
