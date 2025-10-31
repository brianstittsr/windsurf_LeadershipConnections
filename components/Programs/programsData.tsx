import { Program } from "@/types/program";

const programsData: Program[] = [
  {
    id: 1,
    title: "Red Carpet Kids USA",
    paragraph: "Inspiring youth through fitness, creativity, and leadership, Red Carpet Kids USA engages participants in activities designed to promote wellness and self-advocacy while giving back to their communities.",
    image: "/images/hero/pexels-vanessa-loring-7869077.jpg",
    author: {
      name: "Katherine Harreleson",
      image: "/images/blog/author-01.png",
      designation: "Program Director",
    },
    tags: ["Youth", "Fitness", "Creativity"],
    publishDate: "2023-01-01",
    slug: "red-carpet-kids-usa",
    content: "",
  },
  {
    id: 2,
    title: "Michelle Obama Empowerment Academy",
    paragraph: "This initiative empowers young people through leadership training and health education, providing them with the tools they need to succeed while cultivating a culture of health and well-being.",
    image: "/images/hero/pexels-mikhail-nilov-9242856.jpg",
    author: {
      name: "Katherine Harreleson",
      image: "/images/blog/author-01.png",
      designation: "Program Director",
    },
    tags: ["Empowerment", "Leadership", "Health"],
    publishDate: "2023-01-01",
    slug: "michelle-obama-empowerment-academy",
    content: `
      <div class="program-content">
        <h3 class="text-2xl font-bold mb-6 text-black dark:text-white">Empowering Tomorrow's Leaders</h3>
        
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The Michelle Obama Empowerment Academy stands as a beacon of hope and transformation for underexposed and disenfranchised youth in our community. Inspired by the former First Lady's commitment to education, health, and youth empowerment, this comprehensive program addresses the critical need for leadership development and wellness education among young people who face systemic barriers to success.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Our Mission</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          We believe that every young person deserves the opportunity to reach their full potential. Through our academy, we provide participants with the essential tools, knowledge, and support systems needed to become confident leaders in their communities while maintaining healthy lifestyles that support their long-term success.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Program Components</h4>
        
        <div class="mb-6">
          <h5 class="text-lg font-medium mb-3 text-black dark:text-white">Leadership Development</h5>
          <p class="mb-4 text-base leading-relaxed text-body-color">
            Our leadership curriculum focuses on building self-esteem, communication skills, and critical thinking abilities. Participants engage in interactive workshops, peer mentoring sessions, and community service projects that develop their capacity to lead positive change in their neighborhoods and beyond.
          </p>
        </div>

        <div class="mb-6">
          <h5 class="text-lg font-medium mb-3 text-black dark:text-white">Health and Wellness Education</h5>
          <p class="mb-4 text-base leading-relaxed text-body-color">
            Understanding that physical and mental health are foundational to success, our academy provides comprehensive wellness education covering nutrition, physical fitness, mental health awareness, and stress management techniques. Participants learn to make informed decisions about their health while developing sustainable wellness habits.
          </p>
        </div>

        <div class="mb-6">
          <h5 class="text-lg font-medium mb-3 text-black dark:text-white">Community Engagement</h5>
          <p class="mb-4 text-base leading-relaxed text-body-color">
            We emphasize the importance of giving back and staying connected to one's community. Through organized volunteer opportunities, community service projects, and civic engagement activities, participants develop a sense of social responsibility and learn how their individual actions can create positive ripple effects.
          </p>
        </div>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Program Impact</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Since its inception, the Michelle Obama Empowerment Academy has transformed the lives of countless young people, providing them with the confidence, skills, and networks necessary to pursue higher education, meaningful careers, and active community involvement. Our participants consistently demonstrate improved academic performance, enhanced leadership capabilities, and stronger commitment to healthy lifestyle choices.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Who Can Participate</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The academy welcomes young people aged 12-18 who are eager to develop their leadership potential and commit to personal growth. We particularly focus on serving youth from underrepresented communities who may lack access to similar opportunities elsewhere. No prior experience is necessary – only a willingness to learn, grow, and contribute to positive change.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Get Involved</h4>
        <p class="mb-4 text-base leading-relaxed text-body-color">
          Whether you're a young person ready to unlock your potential or a community member interested in supporting our mission, there are multiple ways to engage with the Michelle Obama Empowerment Academy. Contact us to learn about upcoming sessions, volunteer opportunities, or partnership possibilities.
        </p>

        <div class="mt-8 p-6 bg-primary bg-opacity-10 rounded-lg">
          <p class="text-base font-medium text-primary mb-2">Ready to Empower Your Future?</p>
          <p class="text-base text-body-color">
            Join us in creating a generation of empowered, healthy, and engaged leaders who will shape a brighter tomorrow for all.
          </p>
        </div>
      </div>
    `,
  },
  {
    id: 3,
    title: "STEEM Workforce Development Center",
    paragraph: "Our STEEM (Science, Technology, Engineering, Entrepreneurship, Mathematics) center features dynamic workshops where students explore robotics, coding, and hands-on skills in the trades. This program forges problem-solvers ready to meet the demands of tomorrow’s workforce.",
    image: "/images/hero/pexels-pixabay-315934.jpg",
    author: {
      name: "Katherine Harreleson",
      image: "/images/blog/author-01.png",
      designation: "Program Director",
    },
    tags: ["STEEM", "Technology", "Workforce"],
    publishDate: "2023-01-01",
    slug: "steem-workforce-development-center",
    content: "",
  },
];

export default programsData;
