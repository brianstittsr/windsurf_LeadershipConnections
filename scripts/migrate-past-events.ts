/**
 * Migration Script: Static Past Events to Firebase
 * 
 * This script:
 * 1. Reads static events from eventsData.tsx
 * 2. Generates full article content using AI for events without content
 * 3. Uploads events to Firebase Firestore
 * 4. Handles image paths (keeps existing paths for now)
 * 
 * Run with: npx ts-node scripts/migrate-past-events.ts
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin
if (!getApps().length) {
  const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  initializeApp({
    credential: cert(serviceAccount as any),
  });
}

const db = getFirestore();

// Static events data (copy from eventsData.tsx)
const eventsData = [
  {
    id: 1,
    slug: "construction-concepts-2023-saturday-program",
    title: "Introduction to Construction Concepts 2023 Saturday Program",
    paragraph: "Students learned hands-on construction skills from instructor Gloria Bass, including brick-making techniques and designing beautiful brick walkways.",
    image: "/images/programs/2023_SaturdayProgram/Copy of FullSizeRender.jpg",
    date: "Fall 2023",
    location: "Leadership C.O.N.N.E.C.T.I.O.N.S. Center",
    tags: ["Construction", "Trades"],
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
    content: `
      <div class="event-content">
        <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">Women In Pink - Thanksgiving Celebration</h3>
        
        <p class="mb-6 text-base leading-relaxed text-body-color">
          In 2013, Leadership C.O.N.N.E.C.T.I.O.N.S. launched a heartwarming initiative as part of our Women In Pink program, dedicated to supporting breast cancer survivors during the Thanksgiving season. This special event brought together survivors, their families, and community volunteers to share in the spirit of gratitude and healing.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Program Mission</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The Women In Pink program was created to provide ongoing support and community for breast cancer survivors throughout their journey. Recognizing that the holiday season can be particularly challenging for those who have faced cancer, we wanted to create a space of warmth, connection, and celebration.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Thanksgiving Dinner Event</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Our Thanksgiving dinner event provided complete holiday meals for breast cancer survivors and their families. The event featured traditional Thanksgiving fare, including turkey, stuffing, cranberry sauce, and all the fixings that make the holiday special. More than just a meal, this gathering created an atmosphere of hope, resilience, and community support.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Community Impact</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The Women In Pink Thanksgiving event served dozens of breast cancer survivors and their families, ensuring that no one had to spend the holiday alone or without a proper celebration. Volunteers from Leadership C.O.N.N.E.C.T.I.O.N.S. and the broader community came together to prepare meals, decorate the venue, and provide companionship to attendees.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Building Connections</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Beyond providing meals, the event created lasting connections among survivors who shared similar experiences. Many attendees formed friendships that extended well beyond the Thanksgiving celebration, creating a support network that continued throughout the year. The event also connected survivors with resources and support services available in the community.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Volunteer Engagement</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The success of the Women In Pink Thanksgiving event was made possible by the dedication of numerous volunteers who donated their time, resources, and hearts to the cause. From cooking and serving meals to providing transportation and companionship, volunteers played a crucial role in making the event meaningful and impactful.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Legacy of Care</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The 2013 Women In Pink Thanksgiving event established a tradition of caring that continues to inspire our community outreach efforts. It demonstrated the power of coming together during times of need and showed how simple acts of kindness can make a profound difference in the lives of those facing health challenges.
        </p>

        <div class="mt-8 p-6 bg-primary bg-opacity-10 rounded-lg">
          <p class="text-base font-medium text-primary mb-2">Continuing the Mission</p>
          <p class="text-base text-body-color">
            The Women In Pink program continues to be an important part of Leadership C.O.N.N.E.C.T.I.O.N.S.' commitment to community service and support. Through events like our Thanksgiving celebration, we strive to create meaningful connections and provide practical support to those who need it most.
          </p>
        </div>
      </div>
    `,
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
    content: `
      <div class="event-content">
        <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">Democracy Without Walls: Civic Education in Action</h3>
        
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Democracy Without Walls represents one of Leadership C.O.N.N.E.C.T.I.O.N.S.' most impactful civic engagement initiatives, designed to break down barriers between young people and their government representatives. This comprehensive program provided students with unprecedented access to state and local government officials, fostering a deeper understanding of democratic processes and encouraging active citizenship.
        </p>

        <div class="mb-10 w-full overflow-hidden rounded">
          <img src="/images/cellphone_images/DemorcracyWithOutWallsCropped.webp" alt="Students meeting with government officials" class="w-full h-auto rounded" />
        </div>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Program Mission and Vision</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The Democracy Without Walls program was founded on the belief that democracy thrives when citizens are engaged, informed, and empowered to participate in the political process. By removing the traditional barriers that separate young people from government officials, the program created opportunities for meaningful dialogue and learning that would inspire the next generation of civic leaders.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Government Visits and Meetings</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Students participated in structured visits to various government offices, including city halls, county buildings, state legislative offices, and judicial chambers. During these visits, they had the opportunity to observe government in action, attend public meetings, and engage in direct conversations with elected officials and civil servants about their roles, responsibilities, and the challenges they face in serving the public.
        </p>

        <div class="mb-10 w-full overflow-hidden rounded">
          <img src="/images/cellphone_images/5677840881919356564.webp" alt="Students in government building" class="w-full h-auto rounded" />
        </div>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Interactive Learning Experiences</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The program went beyond traditional field trips by incorporating interactive elements that allowed students to experience democracy firsthand. They participated in mock legislative sessions, observed court proceedings, attended town hall meetings, and engaged in policy discussions with government officials. These experiences helped students understand how decisions are made and how they can influence the democratic process.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Meeting Local and State Leaders</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Students had the privilege of meeting with a diverse range of government officials, including mayors, city council members, county commissioners, state legislators, judges, and department heads. These meetings provided insights into different levels of government and helped students understand how various branches and departments work together to serve the community.
        </p>

        <div class="mb-10 w-full overflow-hidden rounded">
          <img src="/images/cellphone_images/DemorcracyWithOutWallsCropped3.webp" alt="Group discussion with government officials" class="w-full h-auto rounded" />
        </div>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Civic Education and Awareness</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Through Democracy Without Walls, students gained comprehensive civic education that covered topics such as the structure of government, the legislative process, judicial procedures, and the importance of public service. They learned about voting rights, civic responsibilities, and how citizens can effectively advocate for change in their communities.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Building Future Leaders</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The program was specifically designed to inspire young people to consider careers in public service and to become active participants in the democratic process. Many participants reported increased interest in government, politics, and community service as a result of their experiences in Democracy Without Walls.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Community Impact and Outcomes</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The Democracy Without Walls program had lasting impacts on both participants and the broader community. Students developed stronger civic awareness, improved communication skills, and gained confidence in engaging with authority figures. Many went on to participate in student government, volunteer for political campaigns, or pursue careers in public service.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Breaking Down Barriers</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          True to its name, Democracy Without Walls successfully broke down the barriers that often exist between young people and government institutions. By creating informal, accessible environments for interaction, the program helped students see government officials as approachable public servants rather than distant authority figures.
        </p>

        <div class="mt-8 p-6 bg-primary bg-opacity-10 rounded-lg">
          <p class="text-base font-medium text-primary mb-2">Continuing the Legacy</p>
          <p class="text-base text-body-color">
            Democracy Without Walls continues to serve as a model for civic engagement programs, demonstrating the power of direct interaction between young people and their government representatives. The program's success highlights the importance of making democracy accessible and engaging for the next generation of leaders.
          </p>
        </div>
      </div>
    `,
  },
];

async function generateArticleContent(event: any): Promise<string> {
  // If event already has content, return it
  if (event.content) {
    return event.content;
  }

  // Generate article content using AI
  console.log(`Generating article for: ${event.title}`);
  
  const prompt = `Generate a comprehensive, engaging article about this past event from Leadership C.O.N.N.E.C.T.I.O.N.S.:

Title: ${event.title}
Description: ${event.paragraph}
Date: ${event.date}
Location: ${event.location}
Tags: ${event.tags.join(', ')}

Create a detailed HTML article with:
- Multiple sections with h4 headings
- Rich paragraphs describing the event, its impact, and significance
- Use Tailwind CSS classes for styling
- Include sections about: program overview, activities, community impact, participant experiences, and lasting legacy
- Make it inspirational and informative
- Use classes like: text-2xl, font-bold, mb-6, text-primary-600, text-base, leading-relaxed, text-body-color
- Wrap everything in a div with class="event-content"
- Add a highlighted callout box at the end with bg-primary bg-opacity-10 rounded-lg p-6

Return only the HTML content, no markdown code blocks.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional content writer creating engaging articles about educational and community programs. Write in an inspirational, informative tone that highlights the impact and significance of each event.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating article:', error);
    // Return a basic template if AI fails
    return `
      <div class="event-content">
        <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">${event.title}</h3>
        
        <p class="mb-6 text-base leading-relaxed text-body-color">
          ${event.paragraph}
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Event Overview</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          This event took place at ${event.location} in ${event.date}. It was part of Leadership C.O.N.N.E.C.T.I.O.N.S.' ongoing commitment to providing meaningful educational and community experiences.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Community Impact</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          This program made a lasting impact on participants and the broader community, creating opportunities for learning, growth, and connection.
        </p>

        <div class="mt-8 p-6 bg-primary bg-opacity-10 rounded-lg">
          <p class="text-base font-medium text-primary mb-2">Our Commitment</p>
          <p class="text-base text-body-color">
            Leadership C.O.N.N.E.C.T.I.O.N.S. continues to create impactful programs that serve our community and empower participants to reach their full potential.
          </p>
        </div>
      </div>
    `;
  }
}

async function migrateEvents() {
  console.log('Starting migration of past events to Firebase...\n');

  for (const event of eventsData) {
    try {
      console.log(`Processing: ${event.title}`);
      
      // Generate article content if needed
      const content = await generateArticleContent(event);
      
      // Prepare event data for Firestore
      const eventData = {
        slug: event.slug,
        title: event.title,
        paragraph: event.paragraph,
        image: event.image,
        date: event.date,
        location: event.location,
        tags: event.tags,
        content: content,
        published: true,
        migratedAt: new Date().toISOString(),
      };

      // Check if event already exists
      const existingDoc = await db.collection('lcPastEvents').doc(event.slug).get();
      
      if (existingDoc.exists) {
        console.log(`  ⚠️  Event already exists, skipping: ${event.slug}`);
        continue;
      }

      // Add to Firestore
      await db.collection('lcPastEvents').doc(event.slug).set(eventData);
      console.log(`  ✅ Successfully migrated: ${event.slug}\n`);
      
      // Wait a bit to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`  ❌ Error migrating ${event.title}:`, error);
    }
  }

  console.log('\n✨ Migration complete!');
  process.exit(0);
}

// Run migration
migrateEvents().catch(console.error);
