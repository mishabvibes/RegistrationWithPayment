import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function GET() {
  try {
    await connectDB();

    // Fetch all registrations
    const registrations = await Registration.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .select('-__v'); // Exclude version key

    return NextResponse.json(registrations, { status: 200 });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations. Please try again.' },
      { status: 500 }
    );
  }
}