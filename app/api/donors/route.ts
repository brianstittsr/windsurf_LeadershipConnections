import { NextRequest, NextResponse } from 'next/server';
import { DonorService } from '@/lib/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const email = searchParams.get('email');

    let donors;
    
    if (type) {
      donors = await DonorService.getDonorsByType(type);
    } else if (email) {
      donors = await DonorService.searchDonorsByEmail(email);
    } else {
      donors = await DonorService.getAllDonors();
    }

    return NextResponse.json({ success: true, donors });
  } catch (error: any) {
    console.error('Error fetching donors:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const donorData = await request.json();
    
    // Validate required fields
    if (!donorData.firstName || !donorData.lastName || !donorData.email) {
      return NextResponse.json(
        { success: false, error: 'First name, last name, and email are required' },
        { status: 400 }
      );
    }

    // Check if donor already exists
    const existingDonors = await DonorService.searchDonorsByEmail(donorData.email);
    if (existingDonors.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Donor with this email already exists' },
        { status: 409 }
      );
    }

    const newDonor = await DonorService.createDonor(donorData);
    return NextResponse.json({ success: true, donor: newDonor });
  } catch (error: any) {
    console.error('Error creating donor:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
