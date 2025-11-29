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

// Static classes data from classUtils.ts
const classesToMigrate = [
  {
    id: 1,
    slug: "class-2016-2017",
    year: "2016-2017",
    title: "Leadership C.O.N.N.E.C.T.I.O.N.S. Class of 2016-2017",
    paragraph: "The 2016-2017 class marked another successful year of empowering young leaders through comprehensive programs in leadership development, community service, and academic excellence.",
    image: "/images/LC_Classes/screen-shot-2017-05-23-at-11-18-36-am_orig.png",
    graduationDate: "May 2017",
    tags: ["Leadership", "Class of 2017"],
    content: `
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        The Leadership C.O.N.N.E.C.T.I.O.N.S. Class of 2016-2017 represented a diverse group of young leaders who dedicated themselves to personal growth, academic excellence, and community service. Throughout the academic year, these students participated in a comprehensive program designed to develop their leadership skills and prepare them for future success.
      </p>
      
      <h3 class="font-xl mb-10 font-bold leading-tight text-primary sm:text-2xl sm:leading-tight lg:text-xl lg:leading-tight xl:text-2xl xl:leading-tight">
        Program Highlights
      </h3>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>Leadership Development:</strong> Students engaged in workshops and seminars focused on developing essential leadership qualities, including effective communication, decision-making, and team collaboration.
      </p>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>Community Service:</strong> The class completed numerous community service projects, demonstrating their commitment to making a positive impact in their local communities.
      </p>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>Academic Support:</strong> Participants received mentoring and academic support to help them achieve their educational goals and prepare for college and career opportunities.
      </p>
      
      <h3 class="font-xl mb-10 font-bold leading-tight text-primary sm:text-2xl sm:leading-tight lg:text-xl lg:leading-tight xl:text-2xl xl:leading-tight">
        Achievements
      </h3>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        The Class of 2016-2017 achieved remarkable milestones, including successful completion of the leadership curriculum, participation in college visits, and engagement in meaningful community service projects. Their dedication and hard work exemplified the mission and values of Leadership C.O.N.N.E.C.T.I.O.N.S.
      </p>
      
      <div class="relative z-10 mb-10 overflow-hidden rounded-md bg-primary bg-opacity-10 p-8 md:p-9 lg:p-8 xl:p-9">
        <p class="text-center text-base font-medium italic text-gray-700">
          "The Class of 2016-2017 demonstrated exceptional commitment to personal growth and community service, setting a strong foundation for their future success."
        </p>
      </div>
    `,
    published: true
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
    content: `
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        The Leadership C.O.N.N.E.C.T.I.O.N.S. Class of 2017-2018 continued the organization's proud tradition of developing young leaders. This dynamic group of students embraced every opportunity to learn, grow, and make a difference in their communities.
      </p>
      
      <h3 class="font-xl mb-10 font-bold leading-tight text-primary sm:text-2xl sm:leading-tight lg:text-xl lg:leading-tight xl:text-2xl xl:leading-tight">
        Program Highlights
      </h3>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>Enhanced Leadership Curriculum:</strong> Building on previous years' success, the 2017-2018 program featured an enhanced curriculum that included advanced leadership workshops, public speaking opportunities, and project management training.
      </p>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>College and Career Preparation:</strong> Students participated in college tours, career exploration activities, and received guidance on the college application process, scholarship opportunities, and career planning.
      </p>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>Community Impact Projects:</strong> The class designed and implemented several community impact projects, addressing local needs and demonstrating their commitment to civic responsibility.
      </p>
      
      <h3 class="font-xl mb-10 font-bold leading-tight text-primary sm:text-2xl sm:leading-tight lg:text-xl lg:leading-tight xl:text-2xl xl:leading-tight">
        Achievements
      </h3>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        The Class of 2017-2018 achieved outstanding results, with many students receiving college acceptances and scholarships. Their dedication to excellence and service left a lasting impact on both the organization and their communities.
      </p>
      
      <div class="relative z-10 mb-10 overflow-hidden rounded-md bg-primary bg-opacity-10 p-8 md:p-9 lg:p-8 xl:p-9">
        <p class="text-center text-base font-medium italic text-gray-700">
          "The Class of 2017-2018 exemplified leadership excellence and demonstrated the transformative power of our programs."
        </p>
      </div>
    `,
    published: true
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
    content: `
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        The Leadership C.O.N.N.E.C.T.I.O.N.S. Class of 2022-2023, our "Leaders of Tomorrow," represented a new generation of change-makers ready to tackle the challenges of the 21st century. This exceptional group of students demonstrated resilience, innovation, and a deep commitment to community service.
      </p>
      
      <h3 class="font-xl mb-10 font-bold leading-tight text-primary sm:text-2xl sm:leading-tight lg:text-xl lg:leading-tight xl:text-2xl xl:leading-tight">
        Program Highlights
      </h3>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>STEM Integration:</strong> The 2022-2023 program featured enhanced STEM components, including technology workshops, coding sessions, and visits to innovation centers and universities.
      </p>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>Leadership in Action:</strong> Students took on leadership roles in organizing events, mentoring younger participants, and representing Leadership C.O.N.N.E.C.T.I.O.N.S. at community functions.
      </p>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>College Success Preparation:</strong> Comprehensive college preparation included SAT/ACT prep, essay writing workshops, financial aid guidance, and campus visits to various colleges and universities.
      </p>
      
      <h3 class="font-xl mb-10 font-bold leading-tight text-primary sm:text-2xl sm:leading-tight lg:text-xl lg:leading-tight xl:text-2xl xl:leading-tight">
        Achievements
      </h3>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        The Leaders of Tomorrow Class of 2022-2023 achieved remarkable success, with students earning college acceptances, scholarships, and recognition for their community service contributions. Their innovative approaches to problem-solving and commitment to excellence set new standards for the program.
      </p>
      
      <div class="relative z-10 mb-10 overflow-hidden rounded-md bg-primary bg-opacity-10 p-8 md:p-9 lg:p-8 xl:p-9">
        <p class="text-center text-base font-medium italic text-gray-700">
          "The Leaders of Tomorrow Class of 2022-2023 embodied innovation, resilience, and a commitment to creating positive change in their communities."
        </p>
      </div>
    `,
    published: true
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
    content: `
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        The Leadership C.O.N.N.E.C.T.I.O.N.S. Class of 2023-2024 represents our most recent cohort of exceptional young leaders. This dynamic group of students embraced every opportunity to develop their skills, expand their horizons, and make meaningful contributions to their communities.
      </p>
      
      <h3 class="font-xl mb-10 font-bold leading-tight text-primary sm:text-2xl sm:leading-tight lg:text-xl lg:leading-tight xl:text-2xl xl:leading-tight">
        Program Highlights
      </h3>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>Comprehensive Leadership Development:</strong> The 2023-2024 program featured an expanded curriculum covering leadership theory, practical application, emotional intelligence, and team dynamics.
      </p>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>Technology and Innovation:</strong> Students participated in cutting-edge technology programs, including visits to Cisco Systems, hands-on STEM activities, and exposure to emerging technologies and career opportunities.
      </p>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>College and Career Readiness:</strong> The class received comprehensive support for college applications, including personalized guidance, scholarship assistance, and exposure to various higher education institutions and career paths.
      </p>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>Community Engagement:</strong> Students designed and implemented impactful community service projects, demonstrating their commitment to social responsibility and civic engagement.
      </p>
      
      <h3 class="font-xl mb-10 font-bold leading-tight text-primary sm:text-2xl sm:leading-tight lg:text-xl lg:leading-tight xl:text-2xl xl:leading-tight">
        Achievements
      </h3>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        The Class of 2023-2024 achieved outstanding results, with students receiving numerous college acceptances, scholarship awards, and recognition for their leadership and service. Their accomplishments reflect the quality and impact of the Leadership C.O.N.N.E.C.T.I.O.N.S. program and their dedication to personal excellence.
      </p>
      
      <div class="relative z-10 mb-10 overflow-hidden rounded-md bg-primary bg-opacity-10 p-8 md:p-9 lg:p-8 xl:p-9">
        <p class="text-center text-base font-medium italic text-gray-700">
          "The Class of 2023-2024 demonstrated exceptional leadership, academic excellence, and a commitment to making a positive difference in the world."
        </p>
      </div>
    `,
    published: true
  }
];

async function migrateClasses() {
  try {
    console.log('🚀 Starting migration of', classesToMigrate.length, 'classes...\n');
    
    for (const classData of classesToMigrate) {
      // Check if class already exists
      const existingQuery = await db.collection('lcPastClasses')
        .where('slug', '==', classData.slug)
        .get();
      
      if (!existingQuery.empty) {
        console.log(`⏭️  Skipping ${classData.year} - already exists`);
        continue;
      }
      
      // Add to Firebase
      const docRef = await db.collection('lcPastClasses').add(classData);
      console.log(`✅ Added ${classData.year} with ID: ${docRef.id}`);
    }
    
    console.log('\n🎉 Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error migrating classes:', error);
    process.exit(1);
  }
}

migrateClasses();
