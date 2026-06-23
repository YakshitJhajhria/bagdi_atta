import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import DistributorApplication from '@/models/DistributorApplication';
import { verifyUserToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const decoded = await verifyUserToken();
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized. Please login first.' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { companyName, gstNumber, expectedMonthlyVolume } = body;

    if (!companyName || !gstNumber || !expectedMonthlyVolume) {
      return NextResponse.json(
        { error: 'All fields (companyName, gstNumber, expectedMonthlyVolume) are required' },
        { status: 400 }
      );
    }

    const volume = Number(expectedMonthlyVolume);
    if (isNaN(volume) || volume <= 0) {
      return NextResponse.json(
        { error: 'Expected monthly volume must be a positive number' },
        { status: 400 }
      );
    }

    // Check if user already has an active application
    const existing = await DistributorApplication.findOne({ userId: decoded.userId });
    if (existing) {
      if (existing.status === 'pending') {
        return NextResponse.json(
          { error: 'You already have a pending distributor application.' },
          { status: 409 }
        );
      } else if (existing.status === 'approved') {
        return NextResponse.json(
          { error: 'Your distributor account is already active and approved.' },
          { status: 409 }
        );
      }
      // If rejected, let them re-apply (delete old or overwrite)
      await DistributorApplication.deleteOne({ userId: decoded.userId });
    }

    const application = await DistributorApplication.create({
      userId: decoded.userId,
      companyName,
      gstNumber,
      expectedMonthlyVolume: volume,
      status: 'pending',
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error: any) {
    console.error('Error submitting distributor application:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
