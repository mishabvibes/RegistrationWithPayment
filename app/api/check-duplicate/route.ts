import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Parse and validate request body
    const { phone } = await request.json();
    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Check for existing registration
    const existingRegistration = await Registration.findOne({ phone });

    return NextResponse.json(
      { exists: !!existingRegistration },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking duplicate:', error);
    return NextResponse.json(
      { error: 'Failed to check duplicate registration. Please try again.' },
      { status: 500 }
    );
  }
}