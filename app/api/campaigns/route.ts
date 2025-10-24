import { NextRequest, NextResponse } from 'next/server';
import { CampaignService } from '@/lib/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let campaigns;
    
    if (status === 'active') {
      campaigns = await CampaignService.getActiveCampaigns();
    } else {
      campaigns = await CampaignService.getAllCampaigns();
    }

    return NextResponse.json({ success: true, campaigns });
  } catch (error: any) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const campaignData = await request.json();
    
    // Validate required fields
    if (!campaignData.name || !campaignData.goal || !campaignData.startDate || !campaignData.endDate) {
      return NextResponse.json(
        { success: false, error: 'Name, goal, start date, and end date are required' },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects
    campaignData.startDate = new Date(campaignData.startDate);
    campaignData.endDate = new Date(campaignData.endDate);

    const newCampaign = await CampaignService.createCampaign(campaignData);
    return NextResponse.json({ success: true, campaign: newCampaign });
  } catch (error: any) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
