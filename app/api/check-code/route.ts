// app/api/check-code/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { code } = await request.json();

    const existingRegistration = await Registration.findOne({ registrationCode: code });

    return NextResponse.json({ exists: !!existingRegistration }, { status: 200 });
  } catch (error) {
    console.error('Error checking registration code:', error);
    return NextResponse.json(
      { error: 'Error checking registration code' },
      { status: 500 }
    );
  }
}