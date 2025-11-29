import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where, orderBy, limit, startAfter, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DatasetRecord, DATASET_COLLECTIONS, validateDataAgainstSchema } from '@/lib/dataset-schema';

// GET /api/datasets/[datasetId]/records - List records with pagination and filtering
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ datasetId: string }> }
) {
  try {
    const { datasetId } = await params;
    const searchParams = request.nextUrl.searchParams;
    
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');
    const sortBy = searchParams.get('sortBy') || 'metadata.submittedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const searchTerm = searchParams.get('search');
    const status = searchParams.get('status') || 'active';

    // Verify dataset exists
    const datasetRef = doc(db, DATASET_COLLECTIONS.datasets, datasetId);
    const datasetSnap = await getDoc(datasetRef);
    
    if (!datasetSnap.exists()) {
      return NextResponse.json(
        { error: 'Dataset not found' },
        { status: 404 }
      );
    }

    let q = query(
      collection(db, DATASET_COLLECTIONS.records),
      where('datasetId', '==', datasetId),
      where('status', '==', status)
    );

    // Add sorting
    q = query(q, orderBy(sortBy, sortOrder as 'asc' | 'desc'));

    // Add pagination
    const startIndex = (page - 1) * pageSize;
    if (startIndex > 0) {
      // For proper pagination, we'd need to store the last document
      // For now, we'll fetch all and slice (not ideal for large datasets)
    }
    
    q = query(q, limit(pageSize));

    const snapshot = await getDocs(q);
    const records: DatasetRecord[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      metadata: {
        ...doc.data().metadata,
        submittedAt: doc.data().metadata?.submittedAt?.toDate() || new Date(),
      },
    })) as DatasetRecord[];

    // Simple search filter (in production, use full-text search service)
    let filteredRecords = records;
    if (searchTerm) {
      filteredRecords = records.filter(record => {
        const searchLower = searchTerm.toLowerCase();
        return Object.values(record.data).some(value => 
          String(value).toLowerCase().includes(searchLower)
        );
      });
    }

    // Get total count
    const totalQuery = query(
      collection(db, DATASET_COLLECTIONS.records),
      where('datasetId', '==', datasetId),
      where('status', '==', status)
    );
    const totalSnapshot = await getDocs(totalQuery);
    const total = totalSnapshot.size;

    return NextResponse.json({
      records: filteredRecords,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error: any) {
    console.error('Error fetching records:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch records' },
      { status: 500 }
    );
  }
}

// POST /api/datasets/[datasetId]/records - Create new record
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ datasetId: string }> }
) {
  try {
    const { datasetId } = await params;
    const body = await request.json();
    const { data, metadata } = body;

    // Verify dataset exists and get schema
    const datasetRef = doc(db, DATASET_COLLECTIONS.datasets, datasetId);
    const datasetSnap = await getDoc(datasetRef);
    
    if (!datasetSnap.exists()) {
      return NextResponse.json(
        { error: 'Dataset not found' },
        { status: 404 }
      );
    }

    const dataset = datasetSnap.data();
    const schema = dataset.schema;

    // Validate data against schema
    const validation = validateDataAgainstSchema(data, schema);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    const now = new Date();
    const recordData = {
      datasetId,
      data,
      metadata: {
        submittedAt: Timestamp.fromDate(now),
        submittedBy: metadata?.submittedBy,
        sourceFormSubmissionId: metadata?.sourceFormSubmissionId,
        sourceApplication: metadata?.sourceApplication || dataset.sourceApplication,
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
        deviceType: metadata?.deviceType,
        location: metadata?.location,
      },
      status: 'active',
      version: 1,
    };

    const docRef = await addDoc(collection(db, DATASET_COLLECTIONS.records), recordData);

    // Update dataset record count
    const currentCount = dataset.metadata?.recordCount || 0;
    await updateDoc(datasetRef, {
      'metadata.recordCount': currentCount + 1,
      'metadata.lastRecordAt': Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });

    const record: DatasetRecord = {
      id: docRef.id,
      ...recordData,
      metadata: {
        ...recordData.metadata,
        submittedAt: now,
      },
    } as DatasetRecord;

    return NextResponse.json({ record, message: 'Record created successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating record:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create record' },
      { status: 500 }
    );
  }
}
