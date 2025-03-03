// app/api/check-referral/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Parse and validate request body
    const { referralCode } = await request.json();
    if (!referralCode) {
      return NextResponse.json(
        { valid: false, error: 'Referral code is required' },
        { status: 400 }
      );
    }

    // Check if the referral code exists in the database
    const registration = await Registration.findOne({ registrationCode: referralCode });

    return NextResponse.json(
      { valid: !!registration },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking referral code:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to check referral code. Please try again.' },
      { status: 500 }
    );
  }
}