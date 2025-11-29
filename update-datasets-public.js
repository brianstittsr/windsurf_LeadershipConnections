/**
 * Script to update existing datasets to be public
 * Run this with: node update-datasets-public.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function updateDatasetsToPublic() {
  try {
    console.log('🔍 Fetching all datasets...');
    
    const datasetsSnapshot = await db.collection('lcDatasets').get();
    
    if (datasetsSnapshot.empty) {
      console.log('❌ No datasets found in Firestore');
      return;
    }
    
    console.log(`📊 Found ${datasetsSnapshot.size} dataset(s)`);
    
    const batch = db.batch();
    let updateCount = 0;
    
    datasetsSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`\n📝 Dataset: ${doc.id}`);
      console.log(`   Name: ${data.name}`);
      console.log(`   Current isPublic: ${data.metadata?.isPublic}`);
      
      if (!data.metadata?.isPublic) {
        batch.update(doc.ref, {
          'metadata.isPublic': true
        });
        updateCount++;
        console.log(`   ✅ Will update to public`);
      } else {
        console.log(`   ⏭️  Already public, skipping`);
      }
    });
    
    if (updateCount > 0) {
      await batch.commit();
      console.log(`\n✅ Successfully updated ${updateCount} dataset(s) to public`);
    } else {
      console.log('\n✅ All datasets are already public');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

updateDatasetsToPublic();
