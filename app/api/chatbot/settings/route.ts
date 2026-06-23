import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ChatbotSetting from '@/models/ChatbotSetting';
import { verifyAdminToken } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    
    // Find settings or create default if not present
    let settings = await ChatbotSetting.findOne({});
    if (!settings) {
      settings = await ChatbotSetting.create({});
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Error fetching chatbot settings:', error);
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
    const { welcomeMessage, moq, distributor, shipping, returns, products, whatsapp } = body;

    let settings = await ChatbotSetting.findOne({});
    if (!settings) {
      settings = new ChatbotSetting({});
    }

    if (welcomeMessage !== undefined) settings.welcomeMessage = welcomeMessage;
    if (moq !== undefined) settings.moq = moq;
    if (distributor !== undefined) settings.distributor = distributor;
    if (shipping !== undefined) settings.shipping = shipping;
    if (returns !== undefined) settings.returns = returns;
    if (products !== undefined) settings.products = products;
    if (whatsapp !== undefined) settings.whatsapp = whatsapp;

    await settings.save();

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Error updating chatbot settings:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
