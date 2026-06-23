import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import DistributorApplication from '@/models/DistributorApplication';
import User from '@/models/User';
import { verifyAdminToken } from '@/lib/auth';

export async function GET() {
  try {
    const isAdmin = await verifyAdminToken();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Fetch and populate applicant user profile (name, email)
    const applications = await DistributorApplication.find({})
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, applications });
  } catch (error: any) {
    console.error('Error fetching distributor applications:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const isAdmin = await verifyAdminToken();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { applicationId, status } = body;

    if (!applicationId || !status) {
      return NextResponse.json({ error: 'applicationId and status are required' }, { status: 400 });
    }

    if (status !== 'approved' && status !== 'rejected') {
      return NextResponse.json(
        { error: 'Invalid status. Allowed values are: approved, rejected' },
        { status: 400 }
      );
    }

    const application = await DistributorApplication.findById(applicationId);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    application.status = status;
    await application.save();

    // If approved, promote the user account role to distributor
    if (status === 'approved') {
      await User.findByIdAndUpdate(application.userId, { role: 'distributor' });
    } else {
      // Revert if they were demoted or keep role customer
      await User.findByIdAndUpdate(application.userId, { role: 'customer' });
    }

    const updatedApp = await DistributorApplication.findById(applicationId).populate('userId', 'name email role');

    return NextResponse.json({ success: true, application: updatedApp });
  } catch (error: any) {
    console.error('Error updating distributor application:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
