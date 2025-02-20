// app/api/create-order/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, phone, address } = await request.json();

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
      amount: 100 * 100,
      currency: 'INR',
      receipt: 'receipt_' + Math.random().toString(36).substring(7),
    });

    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Error creating order' },
      { status: 500 }
    );
  }
}