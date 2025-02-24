import { NextRequest, NextResponse } from 'next/server';
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

// export async function GET() {
//   try {
//     await connectDB();
//     const registrations = await Registration.find({}).sort({ createdAt: -1 });
//     return NextResponse.json(registrations);
//   } catch (error) {
//     console.error('Error fetching registrations:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch registrations' },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.phone || !data.address || !data.registrationCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for duplicate phone number
    const existingRegistration = await Registration.findOne({ phone: data.phone });
    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Phone number already registered' },
        { status: 400 }
      );
    }

    // Check for duplicate registration code
    const existingCode = await Registration.findOne({ 
      registrationCode: data.registrationCode 
    });
    if (existingCode) {
      return NextResponse.json(
        { error: 'Registration code already exists' },
        { status: 400 }
      );
    }

    // Create new registration
    const registration = new Registration({
      name: data.name,
      phone: data.phone,
      address: data.address,
      registrationCode: data.registrationCode,
      paymentId: data.paymentId || 'ADMIN_CREATED', // Default value for admin creation
    });

    await registration.save();

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error('Error creating registration:', error);
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    );
  }
}