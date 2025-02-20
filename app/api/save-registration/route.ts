// app/api/save-registration/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, phone, address, paymentId, registrationCode } = await request.json();

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
      { error: 'Error saving registration' },
      { status: 500 }
    );
  }
}