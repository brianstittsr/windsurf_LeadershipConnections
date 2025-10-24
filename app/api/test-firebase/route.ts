import { NextRequest, NextResponse } from 'next/server';
import { DonorService, DonationService, CampaignService } from '@/lib/firestore';

export async function GET(request: NextRequest) {
  try {
    // Test basic Firebase connection
    console.log('Testing Firebase connection...');
    
    // Test 1: Create a test donor
    const testDonor = await DonorService.createDonor({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@leadershipconnections.org',
      phone: '+1234567890',
      donorType: 'individual',
      tags: ['test-data']
    });
    console.log('✅ Test donor created:', testDonor.id);

    // Test 2: Create a test campaign
    const testCampaign = await CampaignService.createCampaign({
      name: 'Test Campaign',
      description: 'Firebase connectivity test campaign',
      goal: 1000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      type: 'general',
      status: 'active'
    });
    console.log('✅ Test campaign created:', testCampaign.id);

    // Test 3: Create a test donation
    const testDonation = await DonationService.createDonation({
      donorId: testDonor.id,
      amount: 25.00,
      paymentMethod: 'test',
      campaignId: testCampaign.id,
      status: 'completed',
      notes: 'Firebase connectivity test donation'
    });
    console.log('✅ Test donation created:', testDonation.id);

    // Test 4: Query operations
    const allDonors = await DonorService.getAllDonors();
    const donorDonations = await DonationService.getDonationsByDonor(testDonor.id);
    const activeCampaigns = await CampaignService.getActiveCampaigns();

    console.log('✅ Query tests completed');
    console.log(`- Total donors: ${allDonors.length}`);
    console.log(`- Donations for test donor: ${donorDonations.length}`);
    console.log(`- Active campaigns: ${activeCampaigns.length}`);

    // Test 5: Update operations
    await DonorService.updateDonor(testDonor.id, {
      tags: ['test-data', 'updated']
    });
    console.log('✅ Update test completed');

    // Test 6: Clean up test data
    await DonationService.deleteDonation(testDonation.id);
    await CampaignService.deleteCampaign(testCampaign.id);
    await DonorService.deleteDonor(testDonor.id);
    console.log('✅ Cleanup completed');

    return NextResponse.json({
      success: true,
      message: 'Firebase connectivity test completed successfully',
      results: {
        donorCreated: testDonor.id,
        campaignCreated: testCampaign.id,
        donationCreated: testDonation.id,
        totalDonors: allDonors.length,
        donorDonations: donorDonations.length,
        activeCampaigns: activeCampaigns.length
      }
    });

  } catch (error: any) {
    console.error('Firebase test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: 'Check server logs for more information'
    }, { status: 500 });
  }
}
