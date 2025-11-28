// Simple script to add the Health & Fitness blog article to Firebase
// Run this with: npm run add-blog

// Load environment variables
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

// The blog article data
const healthFitnessBlog = {
  id: 1,
  slug: "health-and-fitness-for-youth",
  title: "Why Health and Fitness Matter for Youth",
  paragraph: "In today's fast-paced world, the importance of health and fitness for youth cannot be overstated. The Red Carpet Kids program recognizes this vital connection and is dedicated to empowering young individuals through fitness, wellness, and community engagement.",
  image: "/images/cellphone_images/5517300629519321873.jpg",
  author: {
    name: "TyG",
    image: "/images/history/TyG.webp",
    designation: "Red Carpet Kids Ambassador",
  },
  tags: ["Health", "Fitness"],
  publishDate: "2023-01-01",
  published: true,
  content: `
    <p class="mb-6 text-base leading-relaxed text-body-color">
      In today's fast-paced world, the importance of health and fitness for youth cannot be overstated. As children navigate the complexities of growing up, establishing healthy habits becomes crucial for their physical, mental, and emotional well-being. The Red Carpet Kids program recognizes this vital connection and is dedicated to empowering young individuals through fitness, wellness, and community engagement. Here's why health and fitness matter for youth and how they can shape a brighter future.
    </p>

    <h3 class="mb-4 text-xl font-bold text-primary-600 dark:text-primary-400 sm:text-2xl">1. Physical Health and Development</h3>
    <p class="mb-6 text-base leading-relaxed text-body-color">
      Engaging in regular physical activity is essential for the healthy development of children and adolescents. Exercise helps build strong bones, muscles, and joints while promoting cardiovascular fitness. It also plays a significant role in maintaining a healthy weight and reducing the risk of chronic diseases such as obesity, diabetes, and heart disease. Programs like Red Carpet Kids provide structured fitness initiatives that encourage youth to stay active and embrace healthy lifestyles.
    </p>

    <div class="mb-10 w-full overflow-hidden rounded">
      <img src="/images/cellphone_images/6240569361028218007.jpg" alt="Youth engaging in physical activities" class="w-full object-cover" />
    </div>

    <h3 class="mb-4 text-xl font-bold text-primary-600 dark:text-primary-400 sm:text-2xl">2. Mental Well-Being</h3>
    <p class="mb-6 text-base leading-relaxed text-body-color">
      The benefits of physical activity extend beyond the body; they significantly impact mental health as well. Regular exercise is known to reduce symptoms of anxiety and depression, boost mood, and improve overall mental clarity. By participating in fitness programs, youth can develop coping mechanisms to manage stress and anxiety effectively. The Red Carpet Kids program emphasizes wellness and mental health, ensuring that participants have the tools they need to thrive emotionally.
    </p>

    <h3 class="mb-4 text-xl font-bold text-primary-600 dark:text-primary-400 sm:text-2xl">3. Building Self-Esteem and Confidence</h3>
    <p class="mb-6 text-base leading-relaxed text-body-color">
      Health and fitness activities can greatly enhance self-esteem and confidence among youth. As children set and achieve fitness goals, they experience a sense of accomplishment that translates into other areas of their lives. The Red Carpet Kids program fosters a supportive environment where young individuals can celebrate their achievements, learn new skills, and gain confidence in their abilities. This newfound self-assurance empowers them to take on challenges both inside and outside the gym.
    </p>

    <div class="mb-10 w-full overflow-hidden rounded">
      <img src="/images/cellphone_images/6346572775036824514.jpg" alt="Youth building confidence through fitness" class="w-full object-cover" />
    </div>

    <h3 class="mb-4 text-xl font-bold text-primary-600 dark:text-primary-400 sm:text-2xl">4. Social Connections and Community Engagement</h3>
    <p class="mb-6 text-base leading-relaxed text-body-color">
      Participating in health and fitness programs provides youth with opportunities to connect with peers and build lasting friendships. The Red Carpet Kids program emphasizes teamwork and collaboration, helping participants develop strong social skills and a sense of belonging. By engaging in community service projects and fitness initiatives, youth learn the value of giving back and the importance of supporting one another.
    </p>

    <div class="mb-10 w-full overflow-hidden rounded">
      <img src="/images/cellphone_images/8709093101593225574.jpg" alt="Youth community engagement" class="w-full object-cover" />
    </div>

    <h3 class="mb-4 text-xl font-bold text-primary-600 dark:text-primary-400 sm:text-2xl">5. Lifelong Healthy Habits</h3>
    <p class="mb-6 text-base leading-relaxed text-body-color">
      Instilling healthy habits during youth can lead to a lifetime of well-being. By promoting fitness and nutrition education, programs like Red Carpet Kids equip young individuals with the knowledge and skills they need to make informed choices about their health. These habits, once established, can carry into adulthood, reducing the risk of health issues and fostering a culture of wellness within communities.
    </p>

    <h3 class="mb-4 text-xl font-bold text-primary-600 dark:text-primary-400 sm:text-2xl">Conclusion</h3>
    <p class="mb-6 text-base leading-relaxed text-body-color">
      The importance of health and fitness for youth cannot be underestimated. Programs like Red Carpet Kids play a crucial role in shaping the future of young individuals by promoting physical health, mental well-being, self-esteem, and community engagement. By investing in the health and fitness of our youth today, we are paving the way for a healthier, more empowered generation tomorrow. Let's encourage our young people to embrace active lifestyles and support initiatives that prioritize their well-being. Together, we can make a difference!
    </p>
  `,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date()
};

// Add the blog to Firestore
async function addBlogToFirebase() {
  try {
    console.log('🚀 Adding "Health and Fitness for Youth" blog to Firebase...\n');
    
    const docRef = await addDoc(collection(db, 'blogEntries'), healthFitnessBlog);
    
    console.log('✅ SUCCESS! Blog article added to Firebase!');
    console.log('📄 Document ID:', docRef.id);
    console.log('\n🌐 View the article at:');
    console.log('   http://localhost:3000/blog/health-and-fitness-for-youth');
    console.log('\n⚙️  Manage in admin panel:');
    console.log('   http://localhost:3000/admin/blog-entries');
    console.log('\n✨ Done!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR adding blog to Firebase:', error);
    console.log('\n🔍 Troubleshooting:');
    console.log('1. Make sure Firestore rules are deployed');
    console.log('2. Check your Firebase configuration in .env.local');
    console.log('3. Ensure you have the correct permissions');
    process.exit(1);
  }
}

// Run the function
addBlogToFirebase();
