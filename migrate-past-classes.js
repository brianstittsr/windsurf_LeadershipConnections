// Script to migrate past classes to Firebase
// Run this with: npm run migrate-past-classes

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

// Past Classes Data
const pastClasses = [
  {
    id: 1,
    slug: "class-1998-1999",
    year: "1998-1999",
    title: "Leadership C.O.N.N.E.C.T.I.O.N.S. Class of 1998-1999",
    paragraph: "The inaugural 1998-1999 class marked the beginning of our journey in empowering young leaders through comprehensive programs in leadership development, community service, and academic excellence.",
    image: "/images/LC_Classes/screen-shot-2017-05-23-at-11-18-36-am_orig.png",
    graduationDate: "May 1999",
    tags: ["Leadership", "Class of 1999"],
    published: true,
    content: `
      <div class="class-content">
        <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">The Inaugural Class: 1998-1999</h3>
        
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The 1998-1999 class holds a special place in Leadership C.O.N.N.E.C.T.I.O.N.S. history as our very first graduating class. These pioneering students set the foundation for what would become a transformative program that has impacted hundreds of young leaders over the years.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Program Foundation</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          This inaugural class participated in the development of our core curriculum, helping shape the programs and activities that would define Leadership C.O.N.N.E.C.T.I.O.N.S. for years to come. Their feedback and experiences were instrumental in creating a comprehensive leadership development program.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Leadership Development</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Students in the inaugural class engaged in intensive leadership training, community service projects, and academic enrichment activities. They learned essential skills in communication, teamwork, problem-solving, and civic engagement that prepared them for future success.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Community Impact</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Despite being the first class, these students made significant contributions to their communities through various service projects and initiatives. They demonstrated the power of youth leadership and set a high standard for future classes to follow.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Legacy</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The Class of 1998-1999 established a legacy of excellence that continues to inspire current and future Leadership C.O.N.N.E.C.T.I.O.N.S. participants. Many members of this inaugural class have gone on to become successful professionals, community leaders, and advocates for positive change.
        </p>

        <div class="mt-8 p-6 bg-primary bg-opacity-10 rounded-lg">
          <p class="text-base font-medium text-primary mb-2">Pioneering Spirit</p>
          <p class="text-base text-body-color">
            The inaugural class of 1998-1999 will always be remembered for their courage, dedication, and pioneering spirit in helping establish Leadership C.O.N.N.E.C.T.I.O.N.S. as a premier youth leadership development program.
          </p>
        </div>
      </div>
    `,
    createdAt: new Date('1999-05-01'),
    updatedAt: new Date()
  },
  {
    id: 2,
    slug: "class-2017-2018",
    year: "2017-2018",
    title: "Leadership C.O.N.N.E.C.T.I.O.N.S. Class of 2017-2018",
    paragraph: "The 2017-2018 class continued our tradition of excellence, with students engaging in transformative experiences that prepared them for future success in their academic and professional endeavors.",
    image: "/images/LC_Classes/screen-shot-2018-08-20-at-11-54-47-pm_orig.png",
    graduationDate: "May 2018",
    tags: ["Leadership", "Class of 2018"],
    published: true,
    content: `
      <div class="class-content">
        <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">Class of 2017-2018: Excellence in Action</h3>
        
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The 2017-2018 class represented a milestone in Leadership C.O.N.N.E.C.T.I.O.N.S. history, demonstrating exceptional commitment to personal growth, academic achievement, and community service. This dynamic group of students embraced every opportunity to develop their leadership skills and make a positive impact.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Academic Excellence</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Students in the Class of 2017-2018 achieved remarkable academic success, with many earning scholarships and acceptance to prestigious colleges and universities. The program's emphasis on academic enrichment and college preparation helped students reach their full potential.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Leadership Activities</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Throughout the year, students participated in various leadership development activities, including workshops, seminars, field trips, and hands-on projects. They learned from successful leaders in business, education, government, and nonprofit sectors.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Community Service</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The class completed numerous community service projects, demonstrating their commitment to making a difference in their communities. From organizing food drives to mentoring younger students, they showed that leadership is about service to others.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Personal Growth</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Beyond academic and leadership skills, students experienced significant personal growth. They developed confidence, communication abilities, critical thinking skills, and a strong sense of social responsibility that will serve them throughout their lives.
        </p>

        <div class="mt-8 p-6 bg-primary bg-opacity-10 rounded-lg">
          <p class="text-base font-medium text-primary mb-2">Continuing the Tradition</p>
          <p class="text-base text-body-color">
            The Class of 2017-2018 upheld the high standards set by previous classes while creating their own unique legacy of achievement and service.
          </p>
        </div>
      </div>
    `,
    createdAt: new Date('2018-05-01'),
    updatedAt: new Date()
  },
  {
    id: 3,
    slug: "class-2022-2023",
    year: "2022-2023",
    title: "Leadership C.O.N.N.E.C.T.I.O.N.S. Class of 2022-2023",
    paragraph: "The Leaders of Tomorrow class of 2022-2023 demonstrated exceptional growth and commitment to community service, embodying the values and mission of Leadership C.O.N.N.E.C.T.I.O.N.S.",
    image: "/images/LC_Classes/leadersoftomorrow.png",
    graduationDate: "May 2023",
    tags: ["Leadership", "Class of 2023"],
    published: true,
    content: `
      <div class="class-content">
        <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">Leaders of Tomorrow: Class of 2022-2023</h3>
        
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The Class of 2022-2023, known as the "Leaders of Tomorrow," lived up to their name by demonstrating exceptional leadership qualities, academic achievement, and dedication to community service. This remarkable group of students navigated challenges with resilience and emerged as confident, capable leaders ready to make their mark on the world.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Overcoming Challenges</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          This class showed remarkable adaptability and perseverance, continuing to excel despite various challenges. Their ability to overcome obstacles and maintain focus on their goals demonstrated true leadership character.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Innovative Projects</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Students in the Class of 2022-2023 developed and implemented innovative community service projects that addressed real needs in their communities. From technology initiatives to environmental projects, they showed creativity and initiative in their leadership approach.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">College and Career Preparation</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The program provided comprehensive college and career preparation, including college visits, application workshops, scholarship opportunities, and career exploration activities. Students gained valuable insights into various career paths and developed plans for their future success.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Building Connections</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Throughout the year, students built strong connections with peers, mentors, and community leaders. These relationships provided support, guidance, and networking opportunities that will benefit them for years to come.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Looking Forward</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          As they graduated and moved on to college and careers, the Class of 2022-2023 carried with them the skills, values, and experiences gained through Leadership C.O.N.N.E.C.T.I.O.N.S. They are truly prepared to be the leaders of tomorrow.
        </p>

        <div class="mt-8 p-6 bg-primary bg-opacity-10 rounded-lg">
          <p class="text-base font-medium text-primary mb-2">Future Leaders</p>
          <p class="text-base text-body-color">
            The Leaders of Tomorrow class exemplified the potential of young people to create positive change and demonstrated that the future is in capable hands.
          </p>
        </div>
      </div>
    `,
    createdAt: new Date('2023-05-01'),
    updatedAt: new Date()
  },
  {
    id: 4,
    slug: "class-2023-2024",
    year: "2023-2024",
    title: "Leadership C.O.N.N.E.C.T.I.O.N.S. Class of 2023-2024",
    paragraph: "Our most recent graduating class of 2023-2024 achieved remarkable milestones, participating in diverse programs and making lasting impacts in their communities.",
    image: "/images/programs/Cisco/2023-2024ClassPhoto.jpg",
    graduationDate: "May 2024",
    tags: ["Leadership", "Class of 2024"],
    published: true,
    content: `
      <div class="class-content">
        <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">Class of 2023-2024: Recent Achievements</h3>
        
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The Class of 2023-2024 represents the most recent cohort of Leadership C.O.N.N.E.C.T.I.O.N.S. graduates, bringing fresh energy, innovative ideas, and unwavering commitment to the program. This exceptional group of students achieved remarkable milestones and set new standards for excellence.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Diverse Experiences</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Students participated in a wide range of enrichment activities, including visits to technology companies like Cisco Systems, university tours, professional development workshops, and hands-on learning experiences in various fields. These diverse experiences broadened their horizons and exposed them to numerous career possibilities.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">STEM Focus</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The class showed particular interest in STEM fields, participating in technology workshops, science programs, and engineering projects. Their enthusiasm for innovation and problem-solving demonstrated the importance of STEM education in developing future leaders.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Community Engagement</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Beyond their academic pursuits, students remained deeply committed to community service and civic engagement. They organized and participated in numerous service projects, demonstrating that true leadership involves giving back to the community.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">College Success</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The Class of 2023-2024 achieved outstanding college acceptance rates, with students receiving admission to competitive universities and earning significant scholarship awards. Their success reflects the program's effectiveness in preparing students for higher education.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Building on Legacy</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          While honoring the legacy of previous classes, the Class of 2023-2024 created their own unique impact and set the stage for future Leadership C.O.N.N.E.C.T.I.O.N.S. participants. They demonstrated that each class brings something special to the program.
        </p>

        <div class="mt-8 p-6 bg-primary bg-opacity-10 rounded-lg">
          <p class="text-base font-medium text-primary mb-2">Recent Success</p>
          <p class="text-base text-body-color">
            The Class of 2023-2024 has shown that Leadership C.O.N.N.E.C.T.I.O.N.S. continues to produce exceptional young leaders who are prepared to excel in college, careers, and life.
          </p>
        </div>
      </div>
    `,
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date()
  }
];

// Migrate past classes to Firestore
async function migratePastClasses() {
  console.log('🚀 Migrating past classes to Firebase...\n');
  
  try {
    for (const classItem of pastClasses) {
      console.log(`📝 Adding: ${classItem.title}...`);
      const docRef = await addDoc(collection(db, 'lcPastClasses'), classItem);
      console.log(`✅ Added with ID: ${docRef.id}\n`);
    }
    
    console.log('🎉 SUCCESS! All past classes migrated to Firebase!');
    console.log('\n🌐 View past classes at:');
    console.log('   http://localhost:3000/lc-past-classes');
    console.log('\n⚙️  Manage in admin panel:');
    console.log('   http://localhost:3000/admin/lc-classes');
    console.log('\n✨ Done!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR migrating past classes:', error);
    console.log('\n🔍 Troubleshooting:');
    console.log('1. Make sure Firestore rules are deployed');
    console.log('2. Check your Firebase configuration in .env.local');
    console.log('3. Ensure you have the correct permissions');
    process.exit(1);
  }
}

// Run the function
migratePastClasses();
