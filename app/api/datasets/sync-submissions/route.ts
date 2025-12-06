import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { DATASET_COLLECTIONS } from '@/lib/dataset-schema';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

/**
 * POST /api/datasets/sync-submissions
 * Syncs existing form submissions to their linked datasets
 * 
 * Body (optional):
 * - formId: string - Sync only submissions for a specific form
 * - datasetId: string - Sync only to a specific dataset
 */
export async function POST(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { success: false, error: 'Firebase Admin not configured' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { formId, datasetId } = body;

    console.log('🔄 Starting form submissions to dataset sync...');

    // Build query for datasets
    let datasetsSnapshot;
    if (datasetId) {
      // Sync specific dataset
      const docSnap = await adminDb.collection(DATASET_COLLECTIONS.datasets).doc(datasetId).get();
      datasetsSnapshot = docSnap.exists ? { empty: false, docs: [docSnap], size: 1 } : { empty: true, docs: [], size: 0 };
    } else if (formId) {
      // Sync dataset for specific form
      datasetsSnapshot = await adminDb.collection(DATASET_COLLECTIONS.datasets)
        .where('sourceFormId', '==', formId)
        .get();
    } else {
      // Sync all datasets linked to forms
      datasetsSnapshot = await adminDb.collection(DATASET_COLLECTIONS.datasets)
        .where('status', '==', 'active')
        .get();
    }

    if (datasetsSnapshot.empty) {
      return NextResponse.json({
        success: false,
        message: 'No datasets found to sync',
        synced: 0,
        skipped: 0
      });
    }

    let totalSynced = 0;
    let totalSkipped = 0;
    const results: any[] = [];

    for (const datasetDoc of datasetsSnapshot.docs) {
      const dataset = datasetDoc.data() as { 
        name: string; 
        sourceFormId?: string; 
        status?: string;
      };
      const currentDatasetId = datasetDoc.id;
      const linkedFormId = dataset.sourceFormId;

      if (!linkedFormId) {
        console.log(`⏭️ Dataset ${currentDatasetId} has no linked form, skipping`);
        continue;
      }

      console.log(`📋 Processing dataset: ${dataset.name} (${currentDatasetId})`);
      console.log(`   Linked Form ID: ${linkedFormId}`);

      // Get all form submissions for this form
      const submissionsSnapshot = await adminDb.collection('formSubmissions')
        .where('formId', '==', linkedFormId)
        .get();

      console.log(`   Form submissions found: ${submissionsSnapshot.size}`);

      if (submissionsSnapshot.empty) {
        results.push({
          datasetId: currentDatasetId,
          datasetName: dataset.name,
          synced: 0,
          skipped: 0,
          message: 'No submissions found'
        });
        continue;
      }

      // Get existing dataset records to avoid duplicates
      const existingRecordsSnapshot = await adminDb.collection(DATASET_COLLECTIONS.records)
        .where('datasetId', '==', currentDatasetId)
        .get();

      // Create a set of existing sourceFormSubmissionIds
      const existingSubmissionIds = new Set<string>();
      existingRecordsSnapshot.docs.forEach(doc => {
        const submissionId = doc.data().metadata?.sourceFormSubmissionId;
        if (submissionId) {
          existingSubmissionIds.add(submissionId);
        }
      });

      console.log(`   Existing dataset records: ${existingRecordsSnapshot.size}`);

      // Sync missing submissions
      let syncedCount = 0;
      let skippedCount = 0;

      for (const submissionDoc of submissionsSnapshot.docs) {
        const submission = submissionDoc.data();
        const submissionId = submissionDoc.id;

        // Skip if already synced
        if (existingSubmissionIds.has(submissionId)) {
          skippedCount++;
          continue;
        }

        // Create dataset record
        const submittedAt = submission.submittedAt?.toDate() || new Date();
        const recordData = {
          datasetId: currentDatasetId,
          data: submission.data || {},
          metadata: {
            submittedAt: Timestamp.fromDate(submittedAt),
            sourceFormSubmissionId: submissionId,
            sourceApplication: 'LeadershipConnections',
            deviceType: submission.trackingData?.deviceType,
            userAgent: submission.trackingData?.userAgent,
            location: submission.trackingData?.approximateLocation,
          },
          status: 'active',
          version: 1,
        };

        try {
          await adminDb.collection(DATASET_COLLECTIONS.records).add(recordData);
          syncedCount++;
          console.log(`   ✅ Synced submission ${submissionId}`);
        } catch (error: any) {
          console.error(`   ❌ Error syncing submission ${submissionId}:`, error.message);
        }
      }

      // Update dataset record count
      const newTotalRecords = existingRecordsSnapshot.size + syncedCount;
      await adminDb.collection(DATASET_COLLECTIONS.datasets).doc(currentDatasetId).update({
        'metadata.recordCount': newTotalRecords,
        'metadata.lastRecordAt': Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      });

      totalSynced += syncedCount;
      totalSkipped += skippedCount;

      results.push({
        datasetId: currentDatasetId,
        datasetName: dataset.name,
        synced: syncedCount,
        skipped: skippedCount,
        totalRecords: newTotalRecords
      });

      console.log(`   📈 Synced: ${syncedCount}, Skipped: ${skippedCount}`);
    }

    return NextResponse.json({
      success: true,
      message: `Sync complete. ${totalSynced} records synced, ${totalSkipped} skipped.`,
      synced: totalSynced,
      skipped: totalSkipped,
      results
    });

  } catch (error: any) {
    console.error('❌ Error during sync:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to sync submissions' 
      },
      { status: 500 }
    );
  }
}
