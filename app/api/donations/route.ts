import { NextRequest, NextResponse } from 'next/server';
import { DonationService } from '@/lib/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const donorId = searchParams.get('donorId');
    const campaignId = searchParams.get('campaignId');
    const limit = searchParams.get('limit');

    let donations;
    
    if (donorId) {
      donations = await DonationService.getDonationsByDonor(donorId);
    } else if (campaignId) {
      donations = await DonationService.getDonationsByCampaign(campaignId);
    } else if (limit) {
      donations = await DonationService.getRecentDonations(parseInt(limit));
    } else {
      donations = await DonationService.getRecentDonations();
    }

    return NextResponse.json({ success: true, donations });
  } catch (error: any) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const donationData = await request.json();
    
    // Validate required fields
    if (!donationData.donorId || !donationData.amount || !donationData.paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Donor ID, amount, and payment method are required' },
        { status: 400 }
      );
    }

    const newDonation = await DonationService.createDonation(donationData);
    return NextResponse.json({ success: true, donation: newDonation });
  } catch (error: any) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
