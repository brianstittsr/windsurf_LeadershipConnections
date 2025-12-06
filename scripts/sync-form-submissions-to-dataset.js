/**
 * Sync Form Submissions to Dataset
 * 
 * This script syncs existing form submissions to their linked dataset.
 * Run with: node scripts/sync-form-submissions-to-dataset.js
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  doc,
  Timestamp 
} = require('firebase/firestore');

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validate config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Firebase configuration is missing. Make sure .env.local exists with Firebase credentials.');
  process.exit(1);
}

console.log('🔥 Firebase Project:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DATASET_COLLECTIONS = {
  datasets: 'lcDatasets',
  records: 'lcDatasetRecords',
};

async function syncFormSubmissionsToDataset() {
  console.log('🔄 Starting form submissions to dataset sync...\n');

  try {
    // 1. Get all datasets that are linked to forms
    console.log('📊 Fetching datasets linked to forms...');
    const datasetsQuery = query(
      collection(db, DATASET_COLLECTIONS.datasets),
      where('sourceFormId', '!=', null)
    );
    const datasetsSnapshot = await getDocs(datasetsQuery);
    
    if (datasetsSnapshot.empty) {
      console.log('❌ No datasets found linked to forms');
      return;
    }

    console.log(`Found ${datasetsSnapshot.size} dataset(s) linked to forms\n`);

    for (const datasetDoc of datasetsSnapshot.docs) {
      const dataset = datasetDoc.data();
      const datasetId = datasetDoc.id;
      const formId = dataset.sourceFormId;
      
      console.log(`\n📋 Processing dataset: ${dataset.name}`);
      console.log(`   Dataset ID: ${datasetId}`);
      console.log(`   Linked Form ID: ${formId}`);

      // 2. Get all form submissions for this form
      const submissionsQuery = query(
        collection(db, 'formSubmissions'),
        where('formId', '==', formId)
      );
      const submissionsSnapshot = await getDocs(submissionsQuery);
      
      console.log(`   Form submissions found: ${submissionsSnapshot.size}`);

      if (submissionsSnapshot.empty) {
        console.log('   ⏭️ No submissions to sync');
        continue;
      }

      // 3. Get existing dataset records to avoid duplicates
      const existingRecordsQuery = query(
        collection(db, DATASET_COLLECTIONS.records),
        where('datasetId', '==', datasetId)
      );
      const existingRecordsSnapshot = await getDocs(existingRecordsQuery);
      
      // Create a set of existing sourceFormSubmissionIds
      const existingSubmissionIds = new Set();
      existingRecordsSnapshot.docs.forEach(doc => {
        const submissionId = doc.data().metadata?.sourceFormSubmissionId;
        if (submissionId) {
          existingSubmissionIds.add(submissionId);
        }
      });
      
      console.log(`   Existing dataset records: ${existingRecordsSnapshot.size}`);
      console.log(`   Records with submission IDs: ${existingSubmissionIds.size}`);

      // 4. Sync missing submissions
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
          datasetId,
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
          await addDoc(collection(db, DATASET_COLLECTIONS.records), recordData);
          syncedCount++;
          console.log(`   ✅ Synced submission ${submissionId}`);
        } catch (error) {
          console.error(`   ❌ Error syncing submission ${submissionId}:`, error.message);
        }
      }

      // 5. Update dataset record count
      const newTotalRecords = existingRecordsSnapshot.size + syncedCount;
      await updateDoc(doc(db, DATASET_COLLECTIONS.datasets, datasetId), {
        'metadata.recordCount': newTotalRecords,
        'metadata.lastRecordAt': Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      });

      console.log(`\n   📈 Summary for ${dataset.name}:`);
      console.log(`      - Synced: ${syncedCount} new records`);
      console.log(`      - Skipped: ${skippedCount} (already synced)`);
      console.log(`      - Total records now: ${newTotalRecords}`);
    }

    console.log('\n✅ Sync complete!');
  } catch (error) {
    console.error('❌ Error during sync:', error);
  }
}

// Run the sync
syncFormSubmissionsToDataset().then(() => {
  console.log('\n🏁 Script finished');
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
