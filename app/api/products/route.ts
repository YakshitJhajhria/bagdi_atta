import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Subcategory from '@/models/Subcategory';

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({ isActive: true })
      .populate('category')
      .populate('subcategory')
      .sort({ name: 1 });
    const categories = await Category.find({}).sort({ name: 1 });
    const subcategories = await Subcategory.find({}).sort({ name: 1 });

    return NextResponse.json({ success: true, products, categories, subcategories });
  } catch (error: any) {
    console.error('Error fetching public products:', error);
    let errorMessage = 'Internal Server Error';
    if (error.name === 'MongooseServerSelectionError' || error.message.includes('ServerSelection')) {
      errorMessage = 'Database connection failed. Please ensure your IP address is whitelisted in MongoDB Atlas Network Access.';
    }
    return NextResponse.json({ error: errorMessage, details: error.message }, { status: 500 });
  }
}
