import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyUserToken } from '@/lib/auth';

export async function GET() {
  try {
    const decoded = await verifyUserToken();
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(decoded.userId).select('cart');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, cart: user.cart });
  } catch (error: any) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const decoded = await verifyUserToken();
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { cart } = body;

    if (!Array.isArray(cart)) {
      return NextResponse.json({ error: 'Cart must be an array' }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { cart },
      { new: true, runValidators: true }
    ).select('cart');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, cart: user.cart });
  } catch (error: any) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
