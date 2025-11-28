// Script to migrate past events to Firebase
// Run this with: npm run migrate-past-events

require('dotenv').config({ path: '.env.local' });

const { initializeApp, getApps } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ ERROR: Firebase configuration is missing!');
  console.log('Make sure .env.local file exists with Firebase credentials.');
  process.exit(1);
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Past Events Data
const pastEvents = [
  {
    id: 1,
    slug: "construction-concepts-2023-saturday-program",
    title: "Introduction to Construction Concepts 2023 Saturday Program",
    paragraph: "Students learned hands-on construction skills from instructor Gloria Bass, including brick-making techniques and designing beautiful brick walkways.",
    image: "/images/programs/2023_SaturdayProgram/Copy of FullSizeRender.jpg",
    date: "Fall 2023",
    location: "Leadership C.O.N.N.E.C.T.I.O.N.S. Center",
    tags: ["Construction", "Trades"],
    published: true,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date()
  },
  {
    id: 2,
    slug: "high-point-university-pharmacy-visit",
    title: "High Point University Pharmacy Visit",
    paragraph: "LC students visited High Point University to explore pharmaceutical sciences, meeting with pharmacy professors and learning about chemistry, chemical reactions, and the medicine-making process.",
    image: "/images/programs/HighPoint_University/HPU-2022.jpg",
    date: "2022",
    location: "High Point University",
    tags: ["Science", "Pharmacy"],
    published: true,
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date()
  },
  {
    id: 3,
    slug: "cisco-systems-technology-visit",
    title: "Technology Visit to Cisco Systems in RTP, NC",
    paragraph: "Leadership C.O.N.N.E.C.T.I.O.N.S. members visited Cisco Systems in Research Triangle Park to learn about the company's critical role in powering the Internet and explore cutting-edge technology infrastructure.",
    image: "/images/programs/Cisco/Cisco1.png",
    date: "2023",
    location: "Research Triangle Park, NC",
    tags: ["Technology", "STEM"],
    published: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date()
  },
  {
    id: 4,
    slug: "women-in-pink-thanksgiving",
    title: "Women In Pink: Thanksgiving Dinners for Breast Cancer Survivors",
    paragraph: "Leadership C.O.N.N.E.C.T.I.O.N.S. organized a special Thanksgiving dinner event for breast cancer survivors as part of our Women In Pink program, providing support, community, and celebration during the holiday season.",
    image: "/images/cellphone_images/635737204961078202.jpg",
    date: "2013",
    location: "Leadership C.O.N.N.E.C.T.I.O.N.S. Center",
    tags: ["Community Service", "Women In Pink"],
    published: true,
    content: `
      <div class="event-content">
        <h3 class="text-2xl font-bold mb-6 text-primary-600">Women In Pink - Thanksgiving Celebration</h3>
        
        <p class="mb-6 text-base leading-relaxed text-body-color">
          In 2013, Leadership C.O.N.N.E.C.T.I.O.N.S. launched a heartwarming initiative as part of our Women In Pink program, dedicated to supporting breast cancer survivors during the Thanksgiving season. This special event brought together survivors, their families, and community volunteers to share in the spirit of gratitude and healing.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600">Program Mission</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The Women In Pink program was created to provide ongoing support and community for breast cancer survivors throughout their journey. Recognizing that the holiday season can be particularly challenging for those who have faced cancer, we wanted to create a space of warmth, connection, and celebration.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600">Thanksgiving Dinner Event</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Our Thanksgiving dinner event provided complete holiday meals for breast cancer survivors and their families. The event featured traditional Thanksgiving fare, including turkey, stuffing, cranberry sauce, and all the fixings that make the holiday special. More than just a meal, this gathering created an atmosphere of hope, resilience, and community support.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600">Community Impact</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The Women In Pink Thanksgiving event served dozens of breast cancer survivors and their families, ensuring that no one had to spend the holiday alone or without a proper celebration. Volunteers from Leadership C.O.N.N.E.C.T.I.O.N.S. and the broader community came together to prepare meals, decorate the venue, and provide companionship to attendees.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600">Building Connections</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Beyond providing meals, the event created lasting connections among survivors who shared similar experiences. Many attendees formed friendships that extended well beyond the Thanksgiving celebration, creating a support network that continued throughout the year.
        </p>
      </div>
    `,
    createdAt: new Date('2013-11-01'),
    updatedAt: new Date()
  },
  {
    id: 5,
    slug: "democracy-without-walls",
    title: "Democracy Without Walls: Engaging with Government Leaders",
    paragraph: "Leadership C.O.N.N.E.C.T.I.O.N.S. students participated in Democracy Without Walls, an immersive civic engagement program where they visited and listened to various state and local government officials to understand democratic processes firsthand.",
    image: "/images/cellphone_images/DemorcracyWithOutWalls.jpg",
    date: "2014",
    location: "Various Government Offices",
    tags: ["Civic Engagement", "Government"],
    published: true,
    content: `
      <div class="event-content">
        <h3 class="text-2xl font-bold mb-6 text-primary-600">Democracy Without Walls: Civic Education in Action</h3>
        
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Democracy Without Walls represents one of Leadership C.O.N.N.E.C.T.I.O.N.S.' most impactful civic engagement initiatives, designed to break down barriers between young people and their government representatives. This comprehensive program provided students with unprecedented access to state and local government officials, fostering a deeper understanding of democratic processes and encouraging active citizenship.
        </p>

        <div class="mb-10 w-full overflow-hidden rounded">
          <img src="/images/cellphone_images/DemorcracyWithOutWallsCropped.jpg" alt="Students meeting with government officials" class="w-full h-auto rounded" />
        </div>

        <h4 class="text-xl font-semibold mb-4 text-primary-600">Program Mission and Vision</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The Democracy Without Walls program was founded on the belief that democracy thrives when citizens are engaged, informed, and empowered to participate in the political process. By removing the traditional barriers that separate young people from government officials, the program created opportunities for meaningful dialogue and learning.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600">Government Visits and Meetings</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Students participated in structured visits to various government offices, including city halls, county buildings, state legislative offices, and judicial chambers. During these visits, they had the opportunity to observe government in action, attend public meetings, and engage in direct conversations with elected officials.
        </p>
      </div>
    `,
    createdAt: new Date('2014-01-01'),
    updatedAt: new Date()
  }
];

// Migrate past events to Firestore
async function migratePastEvents() {
  console.log('🚀 Migrating past events to Firebase...\n');
  
  try {
    for (const event of pastEvents) {
      console.log(`📝 Adding: ${event.title}...`);
      const docRef = await addDoc(collection(db, 'lcPastEvents'), event);
      console.log(`✅ Added with ID: ${docRef.id}\n`);
    }
    
    console.log('🎉 SUCCESS! All past events migrated to Firebase!');
    console.log('\n🌐 View past events at:');
    console.log('   http://localhost:3000/lc-past-events');
    console.log('\n⚙️  Manage in admin panel (once created):');
    console.log('   http://localhost:3000/admin/past-events');
    console.log('\n✨ Done!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR migrating past events:', error);
    console.log('\n🔍 Troubleshooting:');
    console.log('1. Make sure Firestore rules are deployed');
    console.log('2. Check your Firebase configuration in .env.local');
    console.log('3. Ensure you have the correct permissions');
    process.exit(1);
  }
}

// Run the function
migratePastEvents();
