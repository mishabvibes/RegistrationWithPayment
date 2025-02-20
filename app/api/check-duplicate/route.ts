// app/api/check-duplicate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { phone } = await request.json();

    const existingRegistration = await Registration.findOne({ phone });

    if (existingRegistration) {
      return NextResponse.json(
        { exists: true, message: 'Phone number already registered' },
        { status: 400 }
      );
    }

    return NextResponse.json({ exists: false }, { status: 200 });
  } catch (error) {
    console.error('Error checking duplicate:', error);
    return NextResponse.json(
      { error: 'Error checking duplicate registration' },
      { status: 500 }
    );
  }
}