import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Parse and validate request body
    const { name, phone, address, paymentId, registrationCode, referredBy } = await request.json();
    if (!name || !phone || !address || !paymentId || !registrationCode) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Create the registration object
    const registrationData = {
      name,
      phone,
      address,
      paymentId,
      registrationCode,
      referredBy: referredBy || null
    };

    // Add referredBy if provided
    if (referredBy) {
      // Verify the referral code exists
      const referrer = await Registration.findOne({ registrationCode: referredBy });
      if (referrer) {
        // Increment the referrer's referral count
        await Registration.updateOne(
          { registrationCode: referredBy },
          { $inc: { referrals: 1 } }
        );
      }
    }

    // Save registration
    const registration = new Registration(registrationData);
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