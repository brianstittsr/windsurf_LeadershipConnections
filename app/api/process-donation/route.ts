import { NextRequest, NextResponse } from 'next/server';
import { DonationService, DonorService } from '@/lib/firestore';

export async function POST(request: NextRequest) {
  try {
    const { 
      paymentIntentId, 
      amount, 
      donorInfo, 
      campaignId 
    } = await request.json();

    // Validate required fields
    if (!paymentIntentId || !amount || !donorInfo) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if donor exists or create new one
    let donor;
    const existingDonors = await DonorService.searchDonorsByEmail(donorInfo.email);
    
    if (existingDonors.length > 0) {
      donor = existingDonors[0];
    } else {
      // Create new donor
      donor = await DonorService.createDonor({
        firstName: donorInfo.firstName || 'Anonymous',
        lastName: donorInfo.lastName || 'Donor',
        email: donorInfo.email,
        phone: donorInfo.phone,
        donorType: 'individual',
        tags: ['online-donation']
      });
    }

    // Create donation record
    const donation = await DonationService.createDonation({
      donorId: donor.id,
      amount: amount,
      currency: 'USD',
      paymentMethod: 'stripe',
      stripePaymentId: paymentIntentId,
      campaignId: campaignId || null,
      isRecurring: false,
      status: 'completed',
      notes: 'Online donation via website'
    });

    return NextResponse.json({
      success: true,
      donation,
      donor: {
        id: donor.id,
        firstName: donor.firstName,
        lastName: donor.lastName,
        email: donor.email
      }
    });

  } catch (error: any) {
    console.error('Error processing donation:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
