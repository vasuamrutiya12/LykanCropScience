import { config } from 'dotenv';
config({ path: '.env.local' });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Product from '../models/Product';
import Admin from '../models/Admin';
import Settings from '../models/Settings';
import { slugify } from '../lib/constants';

const PRODUCTS: { brandName: string; category: 'Insecticide' | 'Fungicide' | 'Herbicide' | 'PGR' }[] = [
  // Insecticide (60)
  { brandName: 'ABAFORCE', category: 'Insecticide' },
  { brandName: 'LYKAN PHATE', category: 'Insecticide' },
  { brandName: 'ALEX-20', category: 'Insecticide' },
  { brandName: 'ALFATIN', category: 'Insecticide' },
  { brandName: 'BLUE-STAR', category: 'Insecticide' },
  { brandName: 'AZENT', category: 'Insecticide' },
  { brandName: 'BAZOCO', category: 'Insecticide' },
  { brandName: 'KING SP', category: 'Insecticide' },
  { brandName: 'CLOSER', category: 'Insecticide' },
  { brandName: 'CARGO', category: 'Insecticide' },
  { brandName: 'CHOICE', category: 'Insecticide' },
  { brandName: 'KOROLA', category: 'Insecticide' },
  { brandName: 'ACROSS', category: 'Insecticide' },
  { brandName: 'CORTY 505', category: 'Insecticide' },
  { brandName: 'CORTY 50', category: 'Insecticide' },
  { brandName: 'CORTY 20', category: 'Insecticide' },
  { brandName: 'LYKAN 10', category: 'Insecticide' },
  { brandName: 'LYKAN 25', category: 'Insecticide' },
  { brandName: 'DETAN', category: 'Insecticide' },
  { brandName: 'DECLARE', category: 'Insecticide' },
  { brandName: 'DOLLAR', category: 'Insecticide' },
  { brandName: 'DUSTER', category: 'Insecticide' },
  { brandName: 'M-TECH', category: 'Insecticide' },
  { brandName: 'RIZON', category: 'Insecticide' },
  { brandName: 'DETOX', category: 'Insecticide' },
  { brandName: 'ERROW', category: 'Insecticide' },
  { brandName: 'LION', category: 'Insecticide' },
  { brandName: 'KRIX PLUS', category: 'Insecticide' },
  { brandName: 'KRIX', category: 'Insecticide' },
  { brandName: 'FENOX', category: 'Insecticide' },
  { brandName: 'ROYAL', category: 'Insecticide' },
  { brandName: 'ROYAL GOLD', category: 'Insecticide' },
  { brandName: 'ELEPHANT', category: 'Insecticide' },
  { brandName: 'PHLORID', category: 'Insecticide' },
  { brandName: 'ISRO', category: 'Insecticide' },
  { brandName: 'ISRO PLUS', category: 'Insecticide' },
  { brandName: 'ISRO STAR', category: 'Insecticide' },
  { brandName: 'ISRO 70', category: 'Insecticide' },
  { brandName: 'LEM PRO', category: 'Insecticide' },
  { brandName: 'INDO', category: 'Insecticide' },
  { brandName: 'CORDON', category: 'Insecticide' },
  { brandName: 'ZYKRON', category: 'Insecticide' },
  { brandName: 'SOLO-5', category: 'Insecticide' },
  { brandName: 'TRISHUL', category: 'Insecticide' },
  { brandName: 'AZARD', category: 'Insecticide' },
  { brandName: 'AZARD PLUS', category: 'Insecticide' },
  { brandName: 'AZARD POWER', category: 'Insecticide' },
  { brandName: 'NEAVY STAR', category: 'Insecticide' },
  { brandName: 'NEAVY', category: 'Insecticide' },
  { brandName: 'PRO COMMANDER', category: 'Insecticide' },
  { brandName: 'COMMANDER', category: 'Insecticide' },
  { brandName: 'SCANNER', category: 'Insecticide' },
  { brandName: 'WILD FORSE', category: 'Insecticide' },
  { brandName: 'DISCOVERY', category: 'Insecticide' },
  { brandName: 'ADVANTAGE', category: 'Insecticide' },
  { brandName: 'KHATMA', category: 'Insecticide' },
  { brandName: 'PRENDA', category: 'Insecticide' },
  { brandName: 'LEGAL', category: 'Insecticide' },
  { brandName: 'UNIVERSAL', category: 'Insecticide' },
  { brandName: 'JAGUAR', category: 'Insecticide' },
  // Fungicide (34 - includes VOLVO, PABLO from spec)
  { brandName: 'AZOGUARD', category: 'Fungicide' },
  { brandName: 'ARTHER', category: 'Fungicide' },
  { brandName: 'LAPPORD', category: 'Fungicide' },
  { brandName: 'AGAIN', category: 'Fungicide' },
  { brandName: 'COMBIFLAM', category: 'Fungicide' },
  { brandName: 'PHANTOM', category: 'Fungicide' },
  { brandName: 'CONTROL PLUS', category: 'Fungicide' },
  { brandName: 'DOLPHIN', category: 'Fungicide' },
  { brandName: 'CHEETAH', category: 'Fungicide' },
  { brandName: 'VULTURE', category: 'Fungicide' },
  { brandName: 'HAMSTER', category: 'Fungicide' },
  { brandName: 'HYENA', category: 'Fungicide' },
  { brandName: 'VIRAL', category: 'Fungicide' },
  { brandName: 'BLACK-ROCK', category: 'Fungicide' },
  { brandName: 'MARTEN-45', category: 'Fungicide' },
  { brandName: 'MENTOS PLUS', category: 'Fungicide' },
  { brandName: 'MAJESTY', category: 'Fungicide' },
  { brandName: 'GIANT', category: 'Fungicide' },
  { brandName: 'PLATINUM', category: 'Fungicide' },
  { brandName: 'OSCAR', category: 'Fungicide' },
  { brandName: 'POLLARD', category: 'Fungicide' },
  { brandName: 'SULTAN', category: 'Fungicide' },
  { brandName: 'SALLAR', category: 'Fungicide' },
  { brandName: 'TURTLE', category: 'Fungicide' },
  { brandName: 'TURKEY', category: 'Fungicide' },
  { brandName: 'TOUCAN', category: 'Fungicide' },
  { brandName: 'TORONTO', category: 'Fungicide' },
  { brandName: 'FANCY', category: 'Fungicide' },
  { brandName: 'BROKO', category: 'Fungicide' },
  { brandName: 'TRACKER', category: 'Fungicide' },
  { brandName: 'ATTEMPT', category: 'Fungicide' },
  { brandName: 'TRACE', category: 'Fungicide' },
  { brandName: 'VOLVO', category: 'Fungicide' },
  { brandName: 'PABLO', category: 'Fungicide' },
  // Herbicide (19)
  { brandName: 'LYKAN 58', category: 'Herbicide' },
  { brandName: 'LYKAN 38', category: 'Herbicide' },
  { brandName: 'FIRE-71', category: 'Herbicide' },
  { brandName: 'ULTRA', category: 'Herbicide' },
  { brandName: 'OREO', category: 'Herbicide' },
  { brandName: 'TITANIUM', category: 'Herbicide' },
  { brandName: 'ERASER', category: 'Herbicide' },
  { brandName: 'BEN-10', category: 'Herbicide' },
  { brandName: 'MIRACLE', category: 'Herbicide' },
  { brandName: 'METRIX', category: 'Herbicide' },
  { brandName: 'BENZO', category: 'Herbicide' },
  { brandName: 'STRIKER', category: 'Herbicide' },
  { brandName: 'MONSTER', category: 'Herbicide' },
  { brandName: 'SMARTY 302', category: 'Herbicide' },
  { brandName: 'SMARTY', category: 'Herbicide' },
  { brandName: 'SMARTY EXTRA', category: 'Herbicide' },
  { brandName: 'PURE 50', category: 'Herbicide' },
  { brandName: 'QUIZ', category: 'Herbicide' },
  { brandName: 'QUIZ KING', category: 'Herbicide' },
  // PGR (18)
  { brandName: 'BLACK GOLD', category: 'PGR' },
  { brandName: 'BRUTO', category: 'PGR' },
  { brandName: 'EAGLE', category: 'PGR' },
  { brandName: 'FLOXIN PLUS', category: 'PGR' },
  { brandName: 'ZAMPA', category: 'PGR' },
  { brandName: 'HUMBLE-98', category: 'PGR' },
  { brandName: 'LYKAN 007', category: 'PGR' },
  { brandName: 'PREMIUM', category: 'PGR' },
  { brandName: 'NECTOR', category: 'PGR' },
  { brandName: 'QUATAR 23', category: 'PGR' },
  { brandName: 'QUATAR 40', category: 'PGR' },
  { brandName: 'SAMRUDHI', category: 'PGR' },
  { brandName: 'ACCURATE', category: 'PGR' },
  { brandName: 'TOOFANI', category: 'PGR' },
  { brandName: 'ULTRA GREENS 35', category: 'PGR' },
  { brandName: 'ULTRA GREENS 80', category: 'PGR' },
  { brandName: 'VIKASH', category: 'PGR' },
  { brandName: 'ZOLTY', category: 'PGR' },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  // Seed admin
  const existingAdmin = await Admin.findOne({ email: 'admin@lykancropscience.com' });
  if (!existingAdmin) {
    const hash = await bcrypt.hash('Lykan@2024', 12);
    await Admin.create({
      email: 'admin@lykancropscience.com',
      passwordHash: hash,
    });
    console.log('Admin created: admin@lykancropscience.com / Lykan@2024');
  }

  // Seed settings
  const existingSettings = await Settings.findOne();
  if (!existingSettings) {
    await Settings.create({});
    console.log('Default settings created');
  }

  // Seed products
  const existingCount = await Product.countDocuments();
  if (existingCount === 0) {
    const products = PRODUCTS.map((p) => ({
      brandName: p.brandName,
      technicalName: '',
      slug: slugify(p.brandName),
      category: p.category,
      dose: '',
      packingSizes: [],
      details: { en: '', gu: '', hi: '' },
      imageUrl: '/images/product-placeholder.svg',
      isFeatured: false,
      isActive: true,
    }));

    // Handle duplicate slugs
    const slugCounts: Record<string, number> = {};
    for (const product of products) {
      if (slugCounts[product.slug]) {
        slugCounts[product.slug]++;
        product.slug = `${product.slug}-${slugCounts[product.slug]}`;
      } else {
        slugCounts[product.slug] = 1;
      }
    }

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);
  } else {
    console.log(`Products already exist (${existingCount}), skipping seed`);
  }

  await mongoose.disconnect();
  console.log('Seed complete');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
