import { NextRequest, NextResponse } from 'next/server';
import { DonorService } from '@/lib/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const donor = await DonorService.getDonor(params.id);
    
    if (!donor) {
      return NextResponse.json(
        { success: false, error: 'Donor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, donor });
  } catch (error: any) {
    console.error('Error fetching donor:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    const updatedDonor = await DonorService.updateDonor(params.id, updates);
    
    return NextResponse.json({ success: true, donor: updatedDonor });
  } catch (error: any) {
    console.error('Error updating donor:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await DonorService.deleteDonor(params.id);
    return NextResponse.json({ success: true, message: 'Donor deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting donor:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
