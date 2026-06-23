import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Subcategory from '@/models/Subcategory';
import { verifyAdminToken } from '@/lib/auth';

function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ name: 1 });
    const subcategories = await Subcategory.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, categories, subcategories });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAdmin = await verifyAdminToken();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { name, description, categoryId } = body; // If categoryId is present, we create a subcategory

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const slug = generateSlug(name);

    if (categoryId) {
      // Create Subcategory
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
        return NextResponse.json({ error: 'Parent Category not found' }, { status: 404 });
      }

      // Check if subcategory slug already exists
      const existingSub = await Subcategory.findOne({ slug });
      if (existingSub) {
        return NextResponse.json({ error: 'Subcategory with a similar name already exists' }, { status: 400 });
      }

      const subcategory = await Subcategory.create({
        name,
        slug,
        category: categoryId,
        description: description || '',
      });

      return NextResponse.json({ success: true, subcategory }, { status: 201 });
    } else {
      // Create Category
      const existingCat = await Category.findOne({ slug });
      if (existingCat) {
        return NextResponse.json({ error: 'Category with a similar name already exists' }, { status: 400 });
      }

      const category = await Category.create({
        name,
        slug,
        description: description || '',
      });

      return NextResponse.json({ success: true, category }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Error creating category/subcategory:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
