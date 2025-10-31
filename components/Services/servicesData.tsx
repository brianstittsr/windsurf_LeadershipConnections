import { Service } from "@/types/service";

const servicesData: Service[] = [
  {
    id: 1,
    slug: "mentoring-services",
    title: "Mentoring Services",
    paragraph: "Comprehensive mentoring programs connecting youth with experienced professionals and peer mentors to guide their personal and professional development.",
    image: "/images/programs/2023_SaturdayProgram/Copy of FullSizeRender(1).jpg",
    author: {
      name: "Katherine Harreleson",
      image: "/images/blog/author-01.png",
      designation: "Program Director",
    },
    tags: ["Mentoring", "Leadership", "Development"],
    publishDate: "2024-01-01",
    content: `
      <div class="service-content">
        <h3 class="text-2xl font-bold mb-6 text-black dark:text-white">Professional Mentoring Services</h3>
        
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Our mentoring services provide comprehensive support through our innovative 3-Tier Mentoring approach, connecting participants with peer mentors, professional mentors, and executive mentors to create a robust support network for personal and professional growth.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Service Components</h4>
        <ul class="mb-6 list-disc list-inside text-base leading-relaxed text-body-color space-y-2">
          <li>One-on-one mentoring sessions with experienced professionals</li>
          <li>Peer mentoring circles for collaborative learning</li>
          <li>Executive mentoring for high-level career guidance</li>
          <li>Group mentoring workshops and seminars</li>
          <li>Career planning and goal-setting sessions</li>
          <li>Networking opportunities with industry leaders</li>
        </ul>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Who Can Benefit</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Our mentoring services are designed for young people aged 12-25 who are seeking guidance in their academic, personal, or professional development. We particularly focus on supporting underrepresented youth who may lack access to professional networks and mentorship opportunities.
        </p>

        <div class="mt-8 p-6 bg-primary bg-opacity-10 rounded-lg">
          <p class="text-base font-medium text-primary mb-2">Ready to Connect with a Mentor?</p>
          <p class="text-base text-body-color mb-4">
            Take the first step towards your personal and professional growth with our comprehensive mentoring services.
          </p>
        </div>
      </div>
    `,
  },
  {
    id: 2,
    slug: "construction-training-demonstrations",
    title: "Construction Training Demonstrations",
    paragraph: "Hands-on construction training demonstrations teaching essential building skills, safety practices, and trade techniques to prepare youth for careers in construction and related fields.",
    image: "/images/programs/2023_SaturdayProgram/Copy of FullSizeRender(1).jpg",
    author: {
      name: "Gloria Bass",
      image: "/images/blog/author-02.png",
      designation: "Construction Training Coordinator",
    },
    tags: ["Construction", "Training", "Trades"],
    publishDate: "2024-01-01",
    content: `
      <div class="service-content">
        <h3 class="text-2xl font-bold mb-6 text-black dark:text-white">Hands-On Construction Training</h3>
        
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Our construction training demonstrations provide practical, hands-on experience in essential building trades. Participants learn fundamental construction concepts, safety practices, and technical skills that prepare them for successful careers in the construction industry.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Training Areas</h4>
        <ul class="mb-6 list-disc list-inside text-base leading-relaxed text-body-color space-y-2">
          <li>Basic construction concepts and building principles</li>
          <li>Brick making and masonry techniques</li>
          <li>Building and designing walkways and structures</li>
          <li>Tool safety and proper equipment usage</li>
          <li>Blueprint reading and project planning</li>
          <li>Quality control and finishing techniques</li>
        </ul>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Learning Outcomes</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Participants will gain practical skills in construction trades, develop problem-solving abilities, and build confidence in working with tools and materials. Our demonstrations emphasize both technical competency and workplace readiness, preparing students for apprenticeships and entry-level positions in construction.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Safety First</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          All training demonstrations prioritize safety education, ensuring participants understand proper safety protocols, protective equipment usage, and hazard recognition essential for construction work environments.
        </p>

        <div class="mt-8 p-6 bg-primary bg-opacity-10 rounded-lg">
          <p class="text-base font-medium text-primary mb-2">Build Your Future</p>
          <p class="text-base text-body-color mb-4">
            Join our construction training demonstrations and start building the skills for a rewarding career in the trades.
          </p>
        </div>
      </div>
    `,
  },
  {
    id: 3,
    slug: "technology-training-demonstrations",
    title: "Technology Training Demonstrations",
    paragraph: "Interactive STEEM-focused technology demonstrations covering robotics, coding, and digital innovation to inspire and prepare youth for technology careers.",
    image: "/images/programs/steem_Academy_Warnersville/STEEM Academy_v2.png",
    author: {
      name: "Katherine Harreleson",
      image: "/images/blog/author-01.png",
      designation: "STEEM Program Director",
    },
    tags: ["Technology", "STEEM", "Innovation"],
    publishDate: "2024-01-01",
    content: `
      <div class="service-content">
        <h3 class="text-2xl font-bold mb-6 text-black dark:text-white">STEEM Technology Demonstrations</h3>
        
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Our technology training demonstrations showcase the exciting world of STEEM (Science, Technology, Engineering, Entrepreneurship, Mathematics) through hands-on experiences with cutting-edge technology, robotics, and digital innovation tools.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Technology Focus Areas</h4>
        <ul class="mb-6 list-disc list-inside text-base leading-relaxed text-body-color space-y-2">
          <li>Robotics programming and operation</li>
          <li>Computer coding and software development</li>
          <li>3D printing and digital fabrication</li>
          <li>Drone technology and applications</li>
          <li>Virtual and augmented reality experiences</li>
          <li>Entrepreneurship and innovation thinking</li>
        </ul>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Interactive Learning</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Our demonstrations are designed to be highly interactive, allowing participants to directly engage with technology rather than simply observing. Students work with real equipment, write actual code, and solve practical problems using technological solutions.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Career Preparation</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          These demonstrations expose participants to high-demand career fields in technology, helping them understand the educational pathways and skills needed for success in STEEM careers. We connect learning to real-world applications and career opportunities.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Innovation Mindset</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Beyond technical skills, our demonstrations foster creative problem-solving, critical thinking, and entrepreneurial mindset essential for success in rapidly evolving technology fields.
        </p>

        <div class="mt-8 p-6 bg-primary bg-opacity-10 rounded-lg">
          <p class="text-base font-medium text-primary mb-2">Explore Technology Careers</p>
          <p class="text-base text-body-color mb-4">
            Discover the exciting possibilities in STEEM fields through our interactive technology demonstrations.
          </p>
        </div>
      </div>
    `,
  },
  {
    id: 4,
    slug: "red-carpet-kids-health-fitness-demonstrations",
    title: "Red Carpet Kids Health and Fitness Event Demonstrations",
    paragraph: "Dynamic health and fitness demonstrations promoting wellness, physical activity, and healthy lifestyle choices through engaging Red Carpet Kids programming.",
    image: "/images/programs/RCK_Performance/RCK in Raliegh performance.jpg",
    author: {
      name: "Katherine Harreleson",
      image: "/images/blog/author-01.png",
      designation: "Health & Wellness Coordinator",
    },
    tags: ["Health", "Fitness", "Wellness"],
    publishDate: "2024-01-01",
    content: `
      <div class="service-content">
        <h3 class="text-2xl font-bold mb-6 text-black dark:text-white">Red Carpet Kids Health & Fitness Events</h3>
        
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Our Red Carpet Kids health and fitness demonstrations create engaging, high-energy events that promote physical wellness, healthy lifestyle choices, and positive self-image among youth through fun, interactive activities and performances.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Event Components</h4>
        <ul class="mb-6 list-disc list-inside text-base leading-relaxed text-body-color space-y-2">
          <li>Interactive fitness demonstrations and activities</li>
          <li>Nutrition education and healthy cooking demos</li>
          <li>Dance and movement performances</li>
          <li>Mental health and wellness workshops</li>
          <li>Team building and cooperative games</li>
          <li>Health screening and wellness assessments</li>
        </ul>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Performance Elements</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Our demonstrations feature dynamic performances that combine entertainment with education, including choreographed fitness routines, motivational presentations, and interactive audience participation that makes learning about health and wellness engaging and memorable.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Community Impact</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          These events serve entire communities, bringing families together around shared wellness goals while providing resources and education that participants can take home and implement in their daily lives.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Sustainable Wellness</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Beyond the event itself, we provide participants with tools, resources, and ongoing support to maintain healthy habits and continue their wellness journey long after the demonstration concludes.
        </p>

        <div class="mt-8 p-6 bg-primary bg-opacity-10 rounded-lg">
          <p class="text-base font-medium text-primary mb-2">Join the Wellness Movement</p>
          <p class="text-base text-body-color mb-4">
            Experience our high-energy health and fitness demonstrations that make wellness fun and accessible for everyone.
          </p>
        </div>
      </div>
    `,
  },
];

export default servicesData;
