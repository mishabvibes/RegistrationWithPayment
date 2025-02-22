import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';

// Validate environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Razorpay credentials are missing in environment variables');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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
    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Phone number already registered' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: 70 * 100, // Amount in paise (70 INR)
      currency: 'INR',
      receipt: `receipt_${Math.random().toString(36).substring(7)}`,
    });

    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    );
  }
}