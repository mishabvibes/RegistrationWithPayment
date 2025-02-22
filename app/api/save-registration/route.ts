import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Parse and validate request body
    const { name, phone, address, paymentId, registrationCode } = await request.json();
    if (!name || !phone || !address || !paymentId || !registrationCode) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Save registration
    const registration = new Registration({
      name,
      phone,
      address,
      paymentId,
      registrationCode,
    });

    await registration.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error saving registration:', error);
    return NextResponse.json(
      { error: 'Failed to save registration. Please try again.' },
      { status: 500 }
    );
  }
}