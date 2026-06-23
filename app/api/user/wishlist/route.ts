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
    const user = await User.findById(decoded.userId).select('wishlist');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, wishlist: user.wishlist });
  } catch (error: any) {
    console.error('Error fetching wishlist:', error);
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
    const { wishlist } = body;

    if (!Array.isArray(wishlist)) {
      return NextResponse.json({ error: 'Wishlist must be an array' }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { wishlist },
      { new: true, runValidators: true }
    ).select('wishlist');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, wishlist: user.wishlist });
  } catch (error: any) {
    console.error('Error updating wishlist:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
