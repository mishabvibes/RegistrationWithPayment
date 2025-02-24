import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';

// Updated using NextRequest directly with SearchParams
export async function PUT(
  request: NextRequest
) {
  try {
    await connectDB();
    
    // Get the code from the URL segments
    const code = request.nextUrl.pathname.split('/').pop();
    const updateData = await request.json();

    const registration = await Registration.findOneAndUpdate(
      { registrationCode: code },
      updateData,
      { new: true }
    );

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(registration);
  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest
) {
  try {
    await connectDB();

    // Get the code from the URL segments
    const code = request.nextUrl.pathname.split('/').pop();
    
    const registration = await Registration.findOneAndDelete({
      registrationCode: code,
    });

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json(
      { error: 'Failed to delete registration' },
      { status: 500 }
    );
  }
}