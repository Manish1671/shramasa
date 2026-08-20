import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole } from '../generated/prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

/** Local product image under frontend/public — always keyed by exact product slug. */
function productImageUrl(slug: string): string {
  return `/products/${slug}.png`;
}

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  ingredients: string;
  howToUse: string;
  price: string;
  compareAtPrice: string;
  stock: number;
  categorySlug: string;
};

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
    name: 'Lip & Fragrance',
    slug: 'lip-fragrance',
    description: 'Nourishing lip care and soft, wearable scent moments.',
  },
  {
    name: 'Ritual Kits',
    slug: 'ritual-kits',
    description: 'Curated sets that simplify your everyday beauty rituals.',
  },
];

const products: SeedProduct[] = [
  // Face Care — 15
  {
    name: 'Gentle Gel Cleanser',
    slug: 'gentle-gel-cleanser',
    description:
      'A lightweight gel cleanser that helps remove everyday impurities while leaving skin feeling soft, fresh, and comfortable.',
    ingredients:
      'Aloe vera, glycerin, panthenol, green tea extract, mild coconut-derived cleansers.',
    howToUse:
      'Massage onto damp skin morning and evening, then rinse thoroughly with lukewarm water.',
    price: '449.00',
    compareAtPrice: '549.00',
    stock: 62,
    categorySlug: 'face-care',
  },
  {
    name: 'Cream Comfort Cleanser',
    slug: 'cream-comfort-cleanser',
    description:
      'A creamy cleanser designed to dissolve makeup and dryness, leaving skin feeling nourished and calm after rinsing.',
    ingredients:
      'Shea butter, glycerin, oat extract, vitamin E, gentle surfactant blend.',
    howToUse:
      'Apply to dry or damp skin, massage gently, and rinse well. Use morning or evening as needed.',
    price: '499.00',
    compareAtPrice: '599.00',
    stock: 48,
    categorySlug: 'face-care',
  },
  {
    name: 'Salicylic Acid Cleanser',
    slug: 'salicylic-acid-cleanser',
    description:
      'A clarifying daily cleanser with salicylic acid to help refine the look of congested skin and leave it feeling clearer and refreshed.',
    ingredients:
      'Salicylic acid (BHA), niacinamide, tea tree leaf extract, glycerin, mild cleansers.',
    howToUse:
      'Massage onto damp skin for 30–60 seconds, then rinse. Use once or twice daily as tolerated.',
    price: '449.00',
    compareAtPrice: '549.00',
    stock: 55,
    categorySlug: 'face-care',
  },
  {
    name: 'Gentle Cleansing Oil',
    slug: 'gentle-cleansing-oil',
    description:
      'A silky cleansing oil that helps melt away sunscreen and long-wear makeup, rinsing clean without a heavy residue.',
    ingredients:
      'Sunflower seed oil, jojoba oil, vitamin E, squalane, mild oil-to-milk emulsifiers.',
    howToUse:
      'Massage onto dry skin, add water to emulsify into a milky rinse, then wash off completely.',
    price: '649.00',
    compareAtPrice: '749.00',
    stock: 40,
    categorySlug: 'face-care',
  },
  {
    name: 'Vitamin C Serum',
    slug: 'vitamin-c-serum',
    description:
      'A brightening antioxidant serum designed to support a more even-looking complexion and leave skin feeling luminous.',
    ingredients:
      'Ethyl ascorbic acid, ferulic acid, vitamin E, hyaluronic acid, centella asiatica.',
    howToUse:
      'Apply 2–3 drops to clean, dry skin before moisturizer. Follow with sunscreen during the day.',
    price: '699.00',
    compareAtPrice: '849.00',
    stock: 58,
    categorySlug: 'face-care',
  },
  {
    name: 'Niacinamide Serum',
    slug: 'niacinamide-serum',
    description:
      'A balancing serum with niacinamide to help maintain a smoother-looking texture and a healthy-looking glow.',
    ingredients:
      'Niacinamide 5%, zinc PCA, panthenol, glycerin, allantoin.',
    howToUse:
      'Apply a few drops after cleansing and toning. Layer under moisturizer morning and evening.',
    price: '599.00',
    compareAtPrice: '749.00',
    stock: 64,
    categorySlug: 'face-care',
  },
  {
    name: 'Hyaluronic Hydration Serum',
    slug: 'hyaluronic-hydration-serum',
    description:
      'A multi-weight hyaluronic serum that helps skin feel deeply hydrated, plump, and comfortably soft.',
    ingredients:
      'Hyaluronic acid complex, betaine, glycerin, aloe vera, panthenol.',
    howToUse:
      'Apply to slightly damp skin, press in gently, then seal with moisturizer.',
    price: '649.00',
    compareAtPrice: '799.00',
    stock: 51,
    categorySlug: 'face-care',
  },
  {
    name: 'Hydrating Toner',
    slug: 'hydrating-toner',
    description:
      'An alcohol-free toner that helps prep skin for the next step and leaves it feeling refreshed and hydrated.',
    ingredients:
      'Rose water, glycerin, hyaluronic acid, cucumber extract, panthenol.',
    howToUse:
      'Sweep over clean skin with hands or a cotton pad before serum.',
    price: '449.00',
    compareAtPrice: '549.00',
    stock: 70,
    categorySlug: 'face-care',
  },
  {
    name: 'Ceramide Moisturizer',
    slug: 'ceramide-moisturizer',
    description:
      'A barrier-supporting cream that helps maintain lasting hydration and leaves skin feeling soft and resilient.',
    ingredients:
      'Ceramide complex, squalane, hyaluronic acid, panthenol, shea butter.',
    howToUse:
      'Smooth over face and neck after serum, morning and evening.',
    price: '599.00',
    compareAtPrice: '699.00',
    stock: 67,
    categorySlug: 'face-care',
  },
  {
    name: 'Hydrating Gel Cream',
    slug: 'hydrating-gel-cream',
    description:
      'A breathable gel-cream moisturizer designed for everyday comfort — lightweight hydration without a heavy feel.',
    ingredients:
      'Hyaluronic acid, aloe vera, niacinamide, glycerin, squalane.',
    howToUse:
      'Apply after serum as your daily moisturizer. Ideal for humid weather and combination skin.',
    price: '549.00',
    compareAtPrice: '649.00',
    stock: 53,
    categorySlug: 'face-care',
  },
  {
    name: 'Acne Spot Gel',
    slug: 'acne-spot-gel',
    description:
      'A targeted gel designed to help improve the look of occasional blemishes and leave the area feeling clearer over time.',
    ingredients:
      'Salicylic acid, niacinamide, tea tree leaf oil, zinc PCA, aloe vera.',
    howToUse:
      'Dab a thin layer onto clean, dry spots after cleansing. Use once or twice daily.',
    price: '399.00',
    compareAtPrice: '499.00',
    stock: 72,
    categorySlug: 'face-care',
  },
  {
    name: 'AHA/BHA Exfoliating Serum',
    slug: 'aha-bha-exfoliating-serum',
    description:
      'A refined exfoliating serum that helps smooth the look of uneven texture and support a brighter-looking finish.',
    ingredients:
      'Lactic acid (AHA), salicylic acid (BHA), niacinamide, glycerin, centella extract.',
    howToUse:
      'Use in the evening on clean, dry skin, 2–3 times a week. Follow with moisturizer and daily sunscreen.',
    price: '699.00',
    compareAtPrice: '849.00',
    stock: 36,
    categorySlug: 'face-care',
  },
  {
    name: 'SPF 50 Sunscreen',
    slug: 'spf-50-sunscreen',
    description:
      'A lightweight broad-spectrum SPF 50 sunscreen with a comfortable finish, designed for everyday wear under makeup or alone.',
    ingredients:
      'Modern UV filters, niacinamide, vitamin E, allantoin, glycerin.',
    howToUse:
      'Apply generously as the final step of your morning ritual. Reapply every two hours with sun exposure.',
    price: '549.00',
    compareAtPrice: '649.00',
    stock: 75,
    categorySlug: 'face-care',
  },
  {
    name: 'Aloe Vera Gel',
    slug: 'aloe-vera-gel',
    description:
      'A cooling multipurpose gel that helps skin feel soothed, hydrated, and comfortably refreshed after sun or cleansing.',
    ingredients:
      'Aloe barbadensis leaf juice, glycerin, vitamin E, allantoin, cucumber extract.',
    howToUse:
      'Apply a thin layer to clean skin as needed. Can be used on face or body.',
    price: '349.00',
    compareAtPrice: '449.00',
    stock: 68,
    categorySlug: 'face-care',
  },
  {
    name: 'Radiance Face Mask',
    slug: 'radiance-face-mask',
    description:
      'A weekly mask designed to leave skin feeling refreshed, soft, and visibly brighter after a short ritual.',
    ingredients:
      'Kaolin clay, niacinamide, vitamin C derivative, rose extract, glycerin.',
    howToUse:
      'Apply an even layer to clean skin, leave for 10–15 minutes, then rinse. Use 1–2 times weekly.',
    price: '499.00',
    compareAtPrice: '599.00',
    stock: 44,
    categorySlug: 'face-care',
  },

  // Hair Care — 8
  {
    name: 'Hair Growth Serum',
    slug: 'hair-growth-serum',
    description:
      'A concentrated scalp serum designed to help support the look of fuller, stronger hair and a healthier-feeling scalp.',
    ingredients:
      'Redensyl, caffeine, niacinamide, rosemary extract, peptide complex.',
    howToUse:
      'Part hair and apply directly to a clean scalp. Massage gently and leave on. Use once daily.',
    price: '799.00',
    compareAtPrice: '949.00',
    stock: 42,
    categorySlug: 'hair-care',
  },
  {
    name: 'Strengthening Shampoo',
    slug: 'strengthening-shampoo',
    description:
      'A balanced shampoo that helps cleanse buildup while leaving hair feeling stronger, softer, and more manageable.',
    ingredients:
      'Hydrolyzed rice protein, biotin, panthenol, aloe vera, gentle surfactants.',
    howToUse:
      'Massage into wet hair and scalp, rinse thoroughly. Repeat if needed.',
    price: '549.00',
    compareAtPrice: '649.00',
    stock: 60,
    categorySlug: 'hair-care',
  },
  {
    name: 'Anti-Dandruff Shampoo',
    slug: 'anti-dandruff-shampoo',
    description:
      'A clarifying shampoo formulated to help reduce the look of flakes and leave the scalp feeling fresh and comfortable.',
    ingredients:
      'Piroctone olamine, tea tree leaf oil, menthol, panthenol, gentle cleansers.',
    howToUse:
      'Apply to wet scalp, massage for 1–2 minutes, then rinse. Use 2–3 times weekly or as needed.',
    price: '499.00',
    compareAtPrice: '599.00',
    stock: 47,
    categorySlug: 'hair-care',
  },
  {
    name: 'Nourishing Conditioner',
    slug: 'nourishing-conditioner',
    description:
      'A creamy conditioner that helps detangle and leave lengths feeling soft, smooth, and lightly nourished.',
    ingredients:
      'Shea butter, argan oil, hydrolyzed keratin, panthenol, cetyl alcohol.',
    howToUse:
      'Apply from mid-lengths to ends after shampooing. Leave for 2–3 minutes, then rinse.',
    price: '499.00',
    compareAtPrice: '599.00',
    stock: 56,
    categorySlug: 'hair-care',
  },
  {
    name: 'Repair Hair Mask',
    slug: 'repair-hair-mask',
    description:
      'A rich weekly mask designed to help restore softness and manageability to dry, stressed strands.',
    ingredients:
      'Coconut oil, shea butter, hydrolyzed protein, vitamin E, argan oil.',
    howToUse:
      'Apply to clean, damp hair from mid-lengths to ends. Leave 5–10 minutes, then rinse thoroughly.',
    price: '649.00',
    compareAtPrice: '749.00',
    stock: 33,
    categorySlug: 'hair-care',
  },
  {
    name: 'Nourishing Hair Oil',
    slug: 'nourishing-hair-oil',
    description:
      'A botanical oil blend that nourishes the scalp and leaves dry lengths feeling smoother and more conditioned.',
    ingredients:
      'Cold-pressed coconut oil, bhringraj, amla, argan oil, rosemary oil, vitamin E.',
    howToUse:
      'Warm a small amount between palms, massage into scalp and lengths, and leave for at least 30 minutes before washing.',
    price: '599.00',
    compareAtPrice: '699.00',
    stock: 61,
    categorySlug: 'hair-care',
  },
  {
    name: 'Scalp Balance Serum',
    slug: 'scalp-balance-serum',
    description:
      'A lightweight scalp serum designed to help maintain a fresh, comfortable scalp feel between wash days.',
    ingredients:
      'Niacinamide, zinc PCA, tea tree leaf extract, panthenol, witch hazel water.',
    howToUse:
      'Apply to the scalp after washing or on dry hair. Massage lightly and do not rinse.',
    price: '699.00',
    compareAtPrice: '849.00',
    stock: 29,
    categorySlug: 'hair-care',
  },
  {
    name: 'Leave-In Conditioner',
    slug: 'leave-in-conditioner',
    description:
      'A featherlight leave-in that helps reduce frizz and leave hair feeling soft, protected, and easy to style.',
    ingredients:
      'Panthenol, argan oil, hydrolyzed silk, glycerin, vitamin E.',
    howToUse:
      'Spray or smooth a small amount onto damp hair, focusing on mid-lengths and ends. Style as usual.',
    price: '549.00',
    compareAtPrice: '649.00',
    stock: 38,
    categorySlug: 'hair-care',
  },

  // Body Care — 7
  {
    name: 'Hydrating Body Lotion',
    slug: 'hydrating-body-lotion',
    description:
      'A fast-absorbing daily lotion that helps replenish dry skin and leaves it feeling smooth without a greasy finish.',
    ingredients:
      'Shea butter, ceramides, glycerin, oat extract, vitamin E.',
    howToUse:
      'Massage generously into clean skin, focusing on dry areas. Reapply whenever needed.',
    price: '499.00',
    compareAtPrice: '599.00',
    stock: 71,
    categorySlug: 'body-care',
  },
  {
    name: 'Gentle Body Wash',
    slug: 'gentle-body-wash',
    description:
      'A mild body wash that cleanses without stripping, leaving skin feeling softly refreshed after every shower.',
    ingredients:
      'Aloe vera, glycerin, coconut-derived cleansers, chamomile extract, vitamin E.',
    howToUse:
      'Lather onto wet skin, rinse thoroughly. Suitable for daily use.',
    price: '449.00',
    compareAtPrice: '549.00',
    stock: 66,
    categorySlug: 'body-care',
  },
  {
    name: 'Botanical Shower Gel',
    slug: 'botanical-shower-gel',
    description:
      'A fragrant botanical shower gel designed to leave skin feeling clean, lightly scented, and comfortably soft.',
    ingredients:
      'Botanical extracts, glycerin, mild surfactants, vitamin E, essential oil blend.',
    howToUse:
      'Apply to wet skin, massage into a light lather, and rinse.',
    price: '449.00',
    compareAtPrice: '549.00',
    stock: 52,
    categorySlug: 'body-care',
  },
  {
    name: 'Whipped Body Cream',
    slug: 'whipped-body-cream',
    description:
      'A rich whipped cream that helps intensely moisturize dry areas and leave skin feeling velvety soft.',
    ingredients:
      'Shea butter, cocoa butter, coconut oil, vitamin E, glycerin.',
    howToUse:
      'Warm a small amount between hands and massage into dry skin after bathing.',
    price: '649.00',
    compareAtPrice: '749.00',
    stock: 34,
    categorySlug: 'body-care',
  },
  {
    name: 'Smoothing Body Scrub',
    slug: 'smoothing-body-scrub',
    description:
      'A gently exfoliating scrub that helps polish away dull surface buildup and leave skin feeling smoother.',
    ingredients:
      'Fine sugar crystals, coconut oil, vitamin E, jojoba beads, citrus peel extract.',
    howToUse:
      'Massage onto damp skin in circular motions, then rinse. Use 1–2 times weekly.',
    price: '549.00',
    compareAtPrice: '649.00',
    stock: 41,
    categorySlug: 'body-care',
  },
  {
    name: 'Pure Glycerin Soap',
    slug: 'pure-glycerin-soap',
    description:
      'A clear glycerin soap bar that cleanses gently and helps skin feel soft and comfortable after rinsing.',
    ingredients:
      'Vegetable glycerin, coconut oil, olive oil, vitamin E, natural soap base.',
    howToUse:
      'Lather with water on hands or a cloth, cleanse skin, and rinse thoroughly.',
    price: '249.00',
    compareAtPrice: '299.00',
    stock: 74,
    categorySlug: 'body-care',
  },
  {
    name: 'Fresh Balance Underarm Roll-On',
    slug: 'fresh-balance-underarm-roll-on',
    description:
      'A lightweight roll-on designed to help maintain a fresh underarm feel through the day with a soft, clean scent.',
    ingredients:
      'Aluminum-free odor-control complex, aloe vera, witch hazel, glycerin, botanical fragrance.',
    howToUse:
      'Apply to clean, dry underarms. Allow to dry before dressing.',
    price: '349.00',
    compareAtPrice: '449.00',
    stock: 59,
    categorySlug: 'body-care',
  },

  // Lip & Fragrance — 4
  {
    name: 'Nourishing Lip Balm',
    slug: 'nourishing-lip-balm',
    description:
      'A comforting lip balm that helps softens dryness and leave lips feeling smooth and cared for.',
    ingredients:
      'Shea butter, beeswax, coconut oil, vitamin E, jojoba oil.',
    howToUse:
      'Apply to lips as needed throughout the day and before bedtime.',
    price: '249.00',
    compareAtPrice: '299.00',
    stock: 73,
    categorySlug: 'lip-fragrance',
  },
  {
    name: 'SPF 30 Lip Balm',
    slug: 'spf-30-lip-balm',
    description:
      'A daily lip balm with SPF 30 designed to help protect lips from sun exposure while keeping them feeling soft.',
    ingredients:
      'Broad-spectrum UV filters, shea butter, vitamin E, beeswax, coconut oil.',
    howToUse:
      'Apply generously before sun exposure and reapply as needed.',
    price: '299.00',
    compareAtPrice: '349.00',
    stock: 50,
    categorySlug: 'lip-fragrance',
  },
  {
    name: 'Overnight Lip Mask',
    slug: 'overnight-lip-mask',
    description:
      'A rich overnight lip mask that helps lips feel deeply nourished and softer by morning.',
    ingredients:
      'Shea butter, lanolin alternative, honey extract, vitamin E, jojoba oil.',
    howToUse:
      'Apply a generous layer before bed. Leave on overnight and blot in the morning if needed.',
    price: '399.00',
    compareAtPrice: '499.00',
    stock: 37,
    categorySlug: 'lip-fragrance',
  },
  {
    name: 'Forest Veil Solid Perfume',
    slug: 'forest-veil-solid-perfume',
    description:
      'A soft solid perfume with a quiet forest-inspired scent — green, warm, and wearable for everyday moments.',
    ingredients:
      'Beeswax base, jojoba oil, botanical fragrance blend, vitamin E.',
    howToUse:
      'Warm a fingertip on the balm and dab onto pulse points as desired.',
    price: '499.00',
    compareAtPrice: '599.00',
    stock: 28,
    categorySlug: 'lip-fragrance',
  },

  // Ritual Kits — 4
  {
    name: 'Glow Ritual Kit',
    slug: 'glow-ritual-kit',
    description:
      'A curated daytime glow set featuring Vitamin C Serum, Hydrating Gel Cream, and SPF 50 Sunscreen for a simple radiance ritual.',
    ingredients:
      'Includes: Vitamin C Serum, Hydrating Gel Cream, SPF 50 Sunscreen. See individual products for full ingredient lists.',
    howToUse:
      'Cleanse, apply Vitamin C Serum, follow with Hydrating Gel Cream, and finish with SPF 50 Sunscreen each morning.',
    price: '1399.00',
    compareAtPrice: '1697.00',
    stock: 18,
    categorySlug: 'ritual-kits',
  },
  {
    name: 'Hair Repair Ritual Kit',
    slug: 'hair-repair-ritual-kit',
    description:
      'A strengthening hair ritual with Strengthening Shampoo, Nourishing Conditioner, Repair Hair Mask, and Nourishing Hair Oil.',
    ingredients:
      'Includes: Strengthening Shampoo, Nourishing Conditioner, Repair Hair Mask, Nourishing Hair Oil. See individual products for full ingredient lists.',
    howToUse:
      'Wash with shampoo, condition lengths, use the mask weekly, and oil before wash days as needed.',
    price: '1599.00',
    compareAtPrice: '1897.00',
    stock: 14,
    categorySlug: 'ritual-kits',
  },
  {
    name: 'Barrier Repair Kit',
    slug: 'barrier-repair-kit',
    description:
      'A comforting barrier-care trio with Gentle Gel Cleanser, Hyaluronic Hydration Serum, and Ceramide Moisturizer.',
    ingredients:
      'Includes: Gentle Gel Cleanser, Hyaluronic Hydration Serum, Ceramide Moisturizer. See individual products for full ingredient lists.',
    howToUse:
      'Cleanse gently, apply hyaluronic serum on damp skin, and seal with ceramide moisturizer morning and night.',
    price: '1299.00',
    compareAtPrice: '1497.00',
    stock: 22,
    categorySlug: 'ritual-kits',
  },
  {
    name: 'Everyday Body Ritual Kit',
    slug: 'everyday-body-ritual-kit',
    description:
      'A complete body ritual with Gentle Body Wash, Smoothing Body Scrub, and Hydrating Body Lotion for soft, cared-for skin.',
    ingredients:
      'Includes: Gentle Body Wash, Smoothing Body Scrub, Hydrating Body Lotion. See individual products for full ingredient lists.',
    howToUse:
      'Cleanse daily, scrub 1–2 times weekly, and moisturize with body lotion after bathing.',
    price: '1199.00',
    compareAtPrice: '1397.00',
    stock: 16,
    categorySlug: 'ritual-kits',
  },
];

const TARGET_SLUGS = new Set(products.map((product) => product.slug));

async function backfillProductCopy(): Promise<void> {
  let updated = 0;
  let missing = 0;

  for (const product of products) {
    const result = await prisma.product.updateMany({
      where: { slug: product.slug },
      data: {
        ingredients: product.ingredients,
        howToUse: product.howToUse,
      },
    });

    if (result.count === 0) {
      missing += 1;
    } else {
      updated += 1;
    }
  }

  console.info(
    `Updated ingredients and how-to on ${updated} product(s). ${missing} slug(s) not in the database.`,
  );
}

async function main(): Promise<void> {
  if (process.argv.includes('--copy-only')) {
    await backfillProductCopy();
    return;
  }
  if (products.length !== 38) {
    throw new Error(`Expected 38 products in seed data, found ${products.length}`);
  }

  const categoryIds = new Map<string, string>();

  for (const category of categories) {
    const savedCategory = await prisma.category.upsert({
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
    const imageUrl = productImageUrl(product.slug);

    const savedProduct = await prisma.product.upsert({
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

    await prisma.productImage.deleteMany({
      where: { productId: savedProduct.id },
    });

    await prisma.productImage.create({
      data: {
        productId: savedProduct.id,
        url: imageUrl,
        altText: savedProduct.name,
        sortOrder: 0,
      },
    });
  }

  // Keep historical products that appear on past orders, but hide them from shop.
  const deactivated = await prisma.product.updateMany({
    where: {
      slug: { notIn: [...TARGET_SLUGS] },
      isActive: true,
    },
    data: { isActive: false },
  });

  const activeCount = await prisma.product.count({ where: { isActive: true } });
  const slugCount = await prisma.product.groupBy({
    by: ['slug'],
    where: { isActive: true },
  });

  if (activeCount !== 38) {
    throw new Error(`Expected 38 active products after seed, found ${activeCount}`);
  }

  if (slugCount.length !== 38) {
    throw new Error('Duplicate active product slugs detected after seed');
  }

  console.info(`Seeded ${categories.length} categories and ${products.length} products.`);
  console.info(`Deactivated ${deactivated.count} legacy product(s) not in the target catalog.`);
  console.info('Product images mapped to local /products/{slug}.png assets.');

  const adminEmail = 'admin@shramasa.com';
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? 'Admin@12345';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: UserRole.ADMIN,
      passwordHash,
      name: 'Shramasa Admin',
      phone: '+910000000000',
    },
    create: {
      email: adminEmail,
      name: 'Shramasa Admin',
      phone: '+910000000000',
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  console.info(`Seeded admin user: ${adminEmail}`);
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
