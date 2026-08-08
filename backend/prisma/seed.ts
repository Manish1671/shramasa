import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

const placeholderImageUrl = 'https://placehold.co/600x600';

const categories = [
  {
    name: 'Face Care',
    slug: 'face-care',
    description: 'Daily essentials for cleansed, hydrated, radiant skin.',
  },
  {
    name: 'Hair Care',
    slug: 'hair-care',
    description: 'Targeted nourishment for stronger, healthier-looking hair.',
  },
  {
    name: 'Body Care',
    slug: 'body-care',
    description: 'Comforting care for soft, smooth, replenished skin.',
  },
  {
    name: 'Sun Care',
    slug: 'sun-care',
    description: 'Everyday protection against the effects of sun exposure.',
  },
];

const products = [
  {
    name: 'Radiance Face Wash',
    slug: 'radiance-face-wash',
    description:
      'A gentle daily cleanser that removes impurities without stripping moisture, leaving skin fresh and luminous.',
    ingredients:
      'Niacinamide, aloe vera, glycerin, green tea extract, mild coconut-derived cleansers.',
    howToUse:
      'Massage a small amount onto damp skin, then rinse thoroughly. Use morning and evening.',
    price: '499.00',
    compareAtPrice: '599.00',
    stock: 80,
    categorySlug: 'face-care',
  },
  {
    name: 'Vitamin C Brightening Serum',
    slug: 'vitamin-c-brightening-serum',
    description:
      'A lightweight antioxidant serum formulated to improve radiance and support a more even-looking complexion.',
    ingredients:
      '10% ethyl ascorbic acid, ferulic acid, vitamin E, hyaluronic acid, centella asiatica.',
    howToUse:
      'Apply two to three drops to clean, dry skin before moisturizer. Follow with sunscreen during the day.',
    price: '899.00',
    compareAtPrice: '1099.00',
    stock: 55,
    categorySlug: 'face-care',
  },
  {
    name: 'Daily Defense Sunscreen',
    slug: 'daily-defense-sunscreen',
    description:
      'A broad-spectrum daily sunscreen with a lightweight, comfortable finish and no heavy residue.',
    ingredients:
      'Modern UV filters, niacinamide, vitamin E, allantoin, glycerin.',
    howToUse:
      'Apply generously to the face and neck 15 minutes before sun exposure. Reapply every two hours.',
    price: '749.00',
    compareAtPrice: '899.00',
    stock: 100,
    categorySlug: 'sun-care',
  },
  {
    name: 'Hydrating Ceramide Moisturizer',
    slug: 'hydrating-ceramide-moisturizer',
    description:
      'A barrier-supporting moisturizer that delivers lasting hydration while remaining soft and breathable on skin.',
    ingredients:
      'Ceramide complex, squalane, hyaluronic acid, panthenol, shea butter.',
    howToUse:
      'Smooth over the face and neck after serum. Use morning and evening.',
    price: '799.00',
    compareAtPrice: '949.00',
    stock: 65,
    categorySlug: 'face-care',
  },
  {
    name: 'Hair Growth Serum',
    slug: 'hair-growth-serum',
    description:
      'A concentrated scalp serum designed to support fuller, stronger-looking hair and healthier roots.',
    ingredients:
      'Redensyl, anagain, caffeine, niacinamide, rosemary extract, peptides.',
    howToUse:
      'Apply directly to a clean scalp and massage gently. Leave on and use consistently once daily.',
    price: '999.00',
    compareAtPrice: '1199.00',
    stock: 45,
    categorySlug: 'hair-care',
  },
  {
    name: 'Strengthening Shampoo',
    slug: 'strengthening-shampoo',
    description:
      'A balanced cleansing shampoo that removes buildup while helping reduce the appearance of breakage.',
    ingredients:
      'Hydrolyzed rice protein, biotin, panthenol, aloe vera, gentle surfactants.',
    howToUse:
      'Massage into wet hair and scalp until lathered, then rinse well. Repeat if needed.',
    price: '649.00',
    compareAtPrice: '799.00',
    stock: 75,
    categorySlug: 'hair-care',
  },
  {
    name: 'Nourishing Hair Oil',
    slug: 'nourishing-hair-oil',
    description:
      'A restorative botanical oil blend that nourishes the scalp and leaves dry lengths smoother and more manageable.',
    ingredients:
      'Cold-pressed coconut oil, bhringraj, amla, argan oil, rosemary oil, vitamin E.',
    howToUse:
      'Warm a small amount between the palms, massage into scalp and lengths, and leave for at least 30 minutes before washing.',
    price: '699.00',
    compareAtPrice: '849.00',
    stock: 70,
    categorySlug: 'hair-care',
  },
  {
    name: 'Hydrating Body Lotion',
    slug: 'hydrating-body-lotion',
    description:
      'A fast-absorbing daily lotion that replenishes dry skin and leaves it smooth without a greasy finish.',
    ingredients:
      'Shea butter, ceramides, glycerin, oat extract, vitamin E.',
    howToUse:
      'Massage generously into clean skin, focusing on dry areas. Reapply whenever needed.',
    price: '599.00',
    compareAtPrice: '749.00',
    stock: 90,
    categorySlug: 'body-care',
  },
];

async function main(): Promise<void> {
  await prisma.$transaction(async (transaction) => {
    const categoryIds = new Map<string, string>();

    for (const category of categories) {
      const savedCategory = await transaction.category.upsert({
        where: { slug: category.slug },
        update: {
          name: category.name,
          description: category.description,
        },
        create: category,
      });

      categoryIds.set(category.slug, savedCategory.id);
    }

    for (const product of products) {
      const categoryId = categoryIds.get(product.categorySlug);

      if (!categoryId) {
        throw new Error(`Category "${product.categorySlug}" was not seeded`);
      }

      const { categorySlug: _, ...productData } = product;
      const savedProduct = await transaction.product.upsert({
        where: { slug: product.slug },
        update: {
          ...productData,
          categoryId,
          isActive: true,
        },
        create: {
          ...productData,
          categoryId,
          isActive: true,
        },
      });

      await transaction.productImage.deleteMany({
        where: {
          productId: savedProduct.id,
          url: placeholderImageUrl,
        },
      });

      await transaction.productImage.create({
        data: {
          productId: savedProduct.id,
          url: placeholderImageUrl,
          altText: `${savedProduct.name} placeholder`,
          sortOrder: 0,
        },
      });
    }
  });

  console.info('Seeded 4 categories and 8 products.');
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
