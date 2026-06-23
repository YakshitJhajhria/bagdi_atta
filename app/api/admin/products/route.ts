import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
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
    const products = await Product.find({})
      .populate('category')
      .populate('subcategory')
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error('Error fetching products:', error);
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
    const { name, description, category, subcategory, variants, nutritionalFacts, specifications, isActive } = body;

    if (!name || !description || !category || !variants || !Array.isArray(variants) || variants.length === 0) {
      return NextResponse.json(
        { error: 'Name, description, category, and at least one variant are required' },
        { status: 400 }
      );
    }

    const slug = generateSlug(name);

    // Check if slug is unique
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json({ error: 'Product with a similar name already exists' }, { status: 400 });
    }

    const product = await Product.create({
      name,
      slug,
      description,
      category,
      subcategory: subcategory || undefined,
      variants,
      nutritionalFacts: nutritionalFacts || [],
      specifications: specifications || [],
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const isAdmin = await verifyAdminToken();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { id, name, description, category, subcategory, variants, nutritionalFacts, specifications, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required for update' }, { status: 400 });
    }

    const updateFields: any = {};
    if (name) {
      updateFields.name = name;
      updateFields.slug = generateSlug(name);
    }
    if (description) updateFields.description = description;
    if (category) updateFields.category = category;
    if (subcategory !== undefined) updateFields.subcategory = subcategory || null;
    if (variants) updateFields.variants = variants;
    if (nutritionalFacts) updateFields.nutritionalFacts = nutritionalFacts;
    if (specifications) updateFields.specifications = specifications;
    if (isActive !== undefined) updateFields.isActive = isActive;

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
