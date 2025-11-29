require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

const db = admin.firestore();

async function updateImage() {
  try {
    // Find the document with slug 'class-1998-1999'
    const querySnapshot = await db.collection('lcPastClasses')
      .where('slug', '==', 'class-1998-1999')
      .get();
    
    if (querySnapshot.empty) {
      console.log('❌ No document found with slug: class-1998-1999');
      process.exit(1);
    }

    const doc = querySnapshot.docs[0];
    await doc.ref.update({
      image: '/images/LC_Classes/leadersoftomorrow.png'
    });

    console.log('✅ Image path updated successfully for Class 1998-1999');
    console.log('📝 Document ID:', doc.id);
    console.log('🖼️  New image path: /images/LC_Classes/leadersoftomorrow.png');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating image:', error);
    process.exit(1);
  }
}

updateImage();
