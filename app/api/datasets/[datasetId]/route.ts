import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Dataset, DATASET_COLLECTIONS } from '@/lib/dataset-schema';

// GET /api/datasets/[datasetId] - Get dataset details
export async function GET(
  request: NextRequest,
  { params }: { params: { datasetId: string } }
) {
  try {
    const { datasetId } = params;

    const docRef = doc(db, DATASET_COLLECTIONS.datasets, datasetId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Dataset not found' },
        { status: 404 }
      );
    }

    const dataset: Dataset = {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate() || new Date(),
      updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      metadata: {
        ...docSnap.data().metadata,
        lastRecordAt: docSnap.data().metadata?.lastRecordAt?.toDate(),
      },
    } as Dataset;

    return NextResponse.json({ dataset });
  } catch (error: any) {
    console.error('Error fetching dataset:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dataset' },
      { status: 500 }
    );
  }
}

// PUT /api/datasets/[datasetId] - Update dataset
export async function PUT(
  request: NextRequest,
  { params }: { params: { datasetId: string } }
) {
  try {
    const { datasetId } = params;
    const body = await request.json();

    const docRef = doc(db, DATASET_COLLECTIONS.datasets, datasetId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Dataset not found' },
        { status: 404 }
      );
    }

    const updateData: any = {
      updatedAt: Timestamp.fromDate(new Date()),
    };

    // Update allowed fields
    if (body.name) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.schema) updateData.schema = body.schema;
    if (body.metadata) updateData.metadata = { ...docSnap.data().metadata, ...body.metadata };
    if (body.permissions) updateData.permissions = body.permissions;
    if (body.integration) updateData.integration = { ...docSnap.data().integration, ...body.integration };
    if (body.displaySettings) updateData.displaySettings = body.displaySettings;

    await updateDoc(docRef, updateData);

    const updatedDoc = await getDoc(docRef);
    const dataset: Dataset = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
      createdAt: updatedDoc.data()?.createdAt?.toDate() || new Date(),
      updatedAt: updatedDoc.data()?.updatedAt?.toDate() || new Date(),
      metadata: {
        ...updatedDoc.data()?.metadata,
        lastRecordAt: updatedDoc.data()?.metadata?.lastRecordAt?.toDate(),
      },
    } as Dataset;

    return NextResponse.json({ dataset, message: 'Dataset updated successfully' });
  } catch (error: any) {
    console.error('Error updating dataset:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update dataset' },
      { status: 500 }
    );
  }
}

// DELETE /api/datasets/[datasetId] - Delete dataset
export async function DELETE(
  request: NextRequest,
  { params }: { params: { datasetId: string } }
) {
  try {
    const { datasetId } = params;

    const docRef = doc(db, DATASET_COLLECTIONS.datasets, datasetId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Dataset not found' },
        { status: 404 }
      );
    }

    // TODO: Also delete all records associated with this dataset
    // This should be done in a batch operation or cloud function for large datasets

    await deleteDoc(docRef);

    return NextResponse.json({ message: 'Dataset deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting dataset:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete dataset' },
      { status: 500 }
    );
  }
}
