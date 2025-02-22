import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Parse and validate request body
    const { code } = await request.json();
    if (!code) {
      return NextResponse.json(
        { error: 'Registration code is required' },
        { status: 400 }
      );
    }

    // Check for existing registration code
    const existingRegistration = await Registration.findOne({ registrationCode: code });

    return NextResponse.json(
      { exists: !!existingRegistration },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking registration code:', error);
    return NextResponse.json(
      { error: 'Failed to check registration code. Please try again.' },
      { status: 500 }
    );
  }
}