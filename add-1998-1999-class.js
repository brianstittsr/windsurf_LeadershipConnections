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

const class1998Data = {
  slug: 'class-1998-1999',
  year: '1998-1999',
  title: 'Leadership North Carolina Class of 1998-1999',
  graduationDate: 'May 1999',
  paragraph: 'The inaugural class of Leadership North Carolina, establishing the foundation for future leaders across the state.',
  image: '/images/classes/class-1998-1999.jpg',
  tags: ['Leadership', 'Inaugural Class', 'Statewide'],
  content: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-primary mb-4">The Inaugural Class</h2>
      
      <p class="text-base leading-relaxed text-gray-700">
        The 1998-1999 class holds a special place in Leadership North Carolina's history as the inaugural cohort 
        that helped establish the program's vision and values. This pioneering group of leaders came together 
        from diverse backgrounds across North Carolina to explore the state's challenges and opportunities.
      </p>

      <h3 class="text-xl font-semibold text-primary mt-6 mb-3">Program Highlights</h3>
      
      <ul class="list-disc list-inside space-y-2 text-gray-700">
        <li>Explored North Carolina's economic development and business climate</li>
        <li>Studied education systems and workforce development initiatives</li>
        <li>Examined healthcare access and rural community challenges</li>
        <li>Engaged with state government and policy leaders</li>
        <li>Developed collaborative networks across geographic and professional boundaries</li>
        <li>Created action projects addressing critical state issues</li>
      </ul>

      <h3 class="text-xl font-semibold text-primary mt-6 mb-3">Legacy and Impact</h3>
      
      <p class="text-base leading-relaxed text-gray-700">
        The Class of 1998-1999 set the standard for future cohorts, demonstrating the power of bringing together 
        diverse leaders to tackle complex challenges. Many class members went on to serve in significant leadership 
        roles in business, government, education, and nonprofit sectors throughout North Carolina.
      </p>

      <div class="bg-blue-50 border-l-4 border-primary p-4 my-6">
        <p class="text-gray-800 italic">
          "Being part of the inaugural class was an honor and a responsibility. We knew we were building something 
          special that would impact North Carolina for generations to come."
        </p>
        <p class="text-gray-600 text-sm mt-2">- Class of 1998-1999 Member</p>
      </div>

      <h3 class="text-xl font-semibold text-primary mt-6 mb-3">Class Projects</h3>
      
      <p class="text-base leading-relaxed text-gray-700">
        The inaugural class focused on several key initiatives:
      </p>

      <ul class="list-disc list-inside space-y-2 text-gray-700 mt-3">
        <li><strong>Education Access:</strong> Developed recommendations for improving educational opportunities in rural areas</li>
        <li><strong>Economic Development:</strong> Created strategies for attracting and retaining businesses across the state</li>
        <li><strong>Community Building:</strong> Established frameworks for cross-sector collaboration</li>
        <li><strong>Leadership Development:</strong> Designed mentorship programs for emerging leaders</li>
      </ul>

      <h3 class="text-xl font-semibold text-primary mt-6 mb-3">Program Structure</h3>
      
      <p class="text-base leading-relaxed text-gray-700">
        The program consisted of multiple multi-day sessions held across North Carolina, including:
      </p>

      <ul class="list-disc list-inside space-y-2 text-gray-700 mt-3">
        <li>Opening retreat in the mountains</li>
        <li>Economic development session in the Piedmont</li>
        <li>Education and workforce development in the Triangle</li>
        <li>Healthcare and rural issues in eastern North Carolina</li>
        <li>Government and policy session in Raleigh</li>
        <li>Graduation ceremony celebrating achievements</li>
      </ul>

      <div class="bg-green-50 border-l-4 border-green-500 p-4 my-6">
        <h4 class="font-semibold text-green-900 mb-2">Did You Know?</h4>
        <p class="text-green-800">
          The inaugural class traveled over 2,000 miles across North Carolina during the program year, 
          visiting all regions of the state and meeting with hundreds of leaders and community members.
        </p>
      </div>

      <h3 class="text-xl font-semibold text-primary mt-6 mb-3">Continuing Impact</h3>
      
      <p class="text-base leading-relaxed text-gray-700">
        Members of the Class of 1998-1999 continue to stay connected through the Leadership North Carolina 
        alumni network. Many have served on boards, mentored subsequent classes, and remained active in 
        addressing North Carolina's most pressing challenges.
      </p>

      <p class="text-base leading-relaxed text-gray-700 mt-4">
        The inaugural class demonstrated that bringing together diverse perspectives and fostering collaborative 
        leadership can create lasting positive change. Their legacy continues to inspire new classes and shape 
        the future of leadership development in North Carolina.
      </p>
    </div>
  `,
  published: true
};

async function addClass() {
  try {
    const docRef = await db.collection('lcPastClasses').add(class1998Data);
    console.log('✅ Class 1998-1999 added successfully with ID:', docRef.id);
    console.log('📝 Slug:', class1998Data.slug);
    console.log('🎓 Year:', class1998Data.year);
    console.log('📅 Graduation Date:', class1998Data.graduationDate);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding class:', error);
    process.exit(1);
  }
}

addClass();
