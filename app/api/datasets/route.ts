import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Dataset, DATASET_COLLECTIONS } from '@/lib/dataset-schema';

// GET /api/datasets - List all datasets
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get('organizationId');
    const sourceApplication = searchParams.get('sourceApplication');
    const category = searchParams.get('category');

    let q = query(collection(db, DATASET_COLLECTIONS.datasets));

    if (organizationId) {
      q = query(q, where('organizationId', '==', organizationId));
    }

    if (sourceApplication) {
      q = query(q, where('sourceApplication', '==', sourceApplication));
    }

    if (category) {
      q = query(q, where('metadata.category', '==', category));
    }

    q = query(q, orderBy('updatedAt', 'desc'));

    const snapshot = await getDocs(q);
    const datasets: Dataset[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      metadata: {
        ...doc.data().metadata,
        lastRecordAt: doc.data().metadata?.lastRecordAt?.toDate(),
      },
    })) as Dataset[];

    return NextResponse.json({ datasets, total: datasets.length });
  } catch (error: any) {
    console.error('Error fetching datasets:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch datasets' },
      { status: 500 }
    );
  }
}

// POST /api/datasets - Create new dataset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      sourceApplication,
      organizationId,
      createdBy,
      schema,
      metadata,
      permissions,
      integration,
      displaySettings,
    } = body;

    // Validation
    if (!name || !sourceApplication || !organizationId || !createdBy) {
      return NextResponse.json(
        { error: 'Missing required fields: name, sourceApplication, organizationId, createdBy' },
        { status: 400 }
      );
    }

    if (!schema || !schema.fields || !Array.isArray(schema.fields)) {
      return NextResponse.json(
        { error: 'Invalid schema: must include fields array' },
        { status: 400 }
      );
    }

    const now = new Date();
    const datasetData = {
      name,
      description: description || '',
      sourceApplication,
      organizationId,
      createdBy,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
      schema: {
        fields: schema.fields,
        version: schema.version || '1.0.0',
        primaryKey: schema.primaryKey,
      },
      metadata: {
        recordCount: 0,
        tags: metadata?.tags || [],
        category: metadata?.category || 'general',
        isPublic: metadata?.isPublic || false,
      },
      permissions: {
        owners: permissions?.owners || [createdBy],
        editors: permissions?.editors || [],
        viewers: permissions?.viewers || [],
        publicRead: permissions?.publicRead || false,
      },
      integration: {
        sourceFormId: integration?.sourceFormId,
        apiKey: integration?.apiKey,
        webhookUrl: integration?.webhookUrl,
        autoSync: integration?.autoSync || false,
      },
      displaySettings: displaySettings || {},
    };

    const docRef = await addDoc(collection(db, DATASET_COLLECTIONS.datasets), datasetData);

    const dataset: Dataset = {
      id: docRef.id,
      ...datasetData,
      createdAt: now,
      updatedAt: now,
    } as Dataset;

    return NextResponse.json({ dataset, message: 'Dataset created successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating dataset:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create dataset' },
      { status: 500 }
    );
  }
}
