const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Light-weight manual env file parser to avoid external dotenv dependency
try {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split(/\r?\n/).forEach((line) => {
      // Ignore comments and empty lines
      if (line.trim().startsWith('#') || !line.trim()) return;
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        // Strip quotes if wrapped
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        // Replace escaped characters like \$
        process.env[key] = value.replace(/\\/g, '');
      }
    });
  }
} catch (err) {
  console.warn('Warning: Failed to parse .env.local file:', err.message);
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI in .env.local');
  process.exit(1);
}

// Define inline schemas to avoid CommonJS/ESM import conflicts in stand-alone execution
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' }
});
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

const SubcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String, default: '' }
});
const Subcategory = mongoose.models.Subcategory || mongoose.model('Subcategory', SubcategorySchema);

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
  variants: [{
    size: { type: String, required: true },
    price: { type: Number, required: true },
    wholesalePrice: { type: Number, required: true },
    stock: { type: Number, default: 0 }
  }],
  nutritionalFacts: [{ label: String, value: String }],
  specifications: [{ label: String, value: String }],
  isActive: { type: Boolean, default: true }
});
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function seed() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected!');

    console.log('Clearing existing categories/products...');
    await Category.deleteMany({});
    await Subcategory.deleteMany({});
    await Product.deleteMany({});

    // 1. Create Categories
    console.log('Creating categories...');
    const floursCat = await Category.create({
      name: 'Flours',
      slug: 'flours',
      description: 'Traditional chakki fresh stone ground flours.'
    });

    const oilsCat = await Category.create({
      name: 'Oils',
      slug: 'oils',
      description: 'Pure cold-pressed healthy cooking oils.'
    });

    const pulsesCat = await Category.create({
      name: 'Pulses',
      slug: 'pulses',
      description: 'Organic unpolished native pulses.'
    });

    // 2. Create Subcategories
    console.log('Creating subcategories...');
    const wholeWheatSub = await Subcategory.create({
      name: 'Whole Wheat',
      slug: 'whole-wheat',
      category: floursCat._id,
      description: '100% whole grain wheat flours.'
    });

    const coldPressedSub = await Subcategory.create({
      name: 'Cold Pressed',
      slug: 'cold-pressed',
      category: oilsCat._id,
      description: 'Wood pressed native seeds extraction.'
    });

    // 3. Create Products
    console.log('Creating products...');
    
    // Atta Product
    await Product.create({
      name: 'Bagdi Atta Whole Wheat Flour',
      slug: 'bagdi-atta',
      description: 'Our signature product. Traditional stone-ground chakki fresh whole wheat flour, packed with natural dietary fibers and vitamins. No preservatives or maida added.',
      category: floursCat._id,
      subcategory: wholeWheatSub._id,
      variants: [
        { size: '5kg', price: 249, wholesalePrice: 199, stock: 500 },
        { size: '10kg', price: 469, wholesalePrice: 369, stock: 350 },
        { size: '25kg', price: 1099, wholesalePrice: 849, stock: 150 }
      ],
      nutritionalFacts: [
        { label: 'Energy', value: '340 kcal' },
        { label: 'Protein', value: '12g' },
        { label: 'Dietary Fiber', value: '11.2g' },
        { label: 'Carbohydrates', value: '73g' },
        { label: 'Fats', value: '1.8g' }
      ],
      specifications: [
        { label: 'Ingredients', value: '100% Sharbati Whole Wheat' },
        { label: 'Shelf Life', value: '3 Months' },
        { label: 'Process', value: 'Chakki Fresh Stone Ground' }
      ]
    });

    // Mustard Oil Product
    await Product.create({
      name: 'Bagdi Cold Pressed Mustard Oil',
      slug: 'mustard-oil',
      description: '100% pure cold-pressed yellow mustard oil. Extracted traditionally in wood kolhu at low temperatures to keep nutrients, healthy fats, and sharp natural aroma intact.',
      category: oilsCat._id,
      subcategory: coldPressedSub._id,
      variants: [
        { size: '1L', price: 189, wholesalePrice: 149, stock: 300 },
        { size: '5L', price: 899, wholesalePrice: 729, stock: 100 }
      ],
      nutritionalFacts: [
        { label: 'Energy', value: '898 kcal' },
        { label: 'Monounsaturated Fats', value: '59g' },
        { label: 'Polyunsaturated Fats', value: '21g' },
        { label: 'Saturated Fats', value: '12g' }
      ],
      specifications: [
        { label: 'Ingredients', value: '100% Yellow Mustard Seeds' },
        { label: 'Shelf Life', value: '12 Months' },
        { label: 'Process', value: 'Wood Kolhu Pressed (Kachi Ghani)' }
      ]
    });

    // Pulses Product
    await Product.create({
      name: 'Bagdi Organic Moong Dal',
      slug: 'moong-dal',
      description: 'Premium organic unpolished split moong dal (yellow/green). Grown natively without artificial chemical enhancers, packed with heavy plant proteins.',
      category: pulsesCat._id,
      variants: [
        { size: '1kg', price: 149, wholesalePrice: 119, stock: 400 },
        { size: '2kg', price: 289, wholesalePrice: 229, stock: 200 }
      ],
      nutritionalFacts: [
        { label: 'Energy', value: '348 kcal' },
        { label: 'Protein', value: '24g' },
        { label: 'Dietary Fiber', value: '16g' },
        { label: 'Carbohydrates', value: '62g' }
      ],
      specifications: [
        { label: 'Ingredients', value: '100% Organic Moong Beans' },
        { label: 'Shelf Life', value: '6 Months' },
        { label: 'Polishing', value: 'Unpolished (Natural)' }
      ]
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
