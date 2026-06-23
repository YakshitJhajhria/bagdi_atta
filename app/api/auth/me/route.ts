import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyUserToken } from '@/lib/auth';

export async function GET() {
  try {
    const decoded = await verifyUserToken();
    if (!decoded) {
      return NextResponse.json({ user: null });
    }

    await dbConnect();
    const user = await User.findById(decoded.userId).select('-password');
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Fetch profile me error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
