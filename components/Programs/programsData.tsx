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
        <h3 class="text-2xl font-bold mb-6 text-black dark:text-white">Program Goals</h3>
        
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The Michelle Obama Empowerment Academy empowers young people through leadership training and health education, providing them with the tools they need to succeed while cultivating a culture of health and well-being.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Our Objectives</h4>
        <ul class="mb-6 list-disc list-inside text-base leading-relaxed text-body-color space-y-2">
          <li>Develop leadership skills through interactive workshops and peer mentoring</li>
          <li>Promote health and wellness education covering nutrition, fitness, and mental health</li>
          <li>Foster community engagement through service projects and civic activities</li>
          <li>Build self-esteem and communication skills in young participants</li>
          <li>Connect students with professional mentors in their fields of interest</li>
        </ul>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Community Outreach</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          We actively reach out to underserved communities to ensure equal access to our programs. Our outreach efforts focus on connecting with schools, community centers, and local organizations to identify young people who would benefit most from our leadership development opportunities.
        </p>

        <p class="mb-6 text-base leading-relaxed text-body-color">
          The academy welcomes young people aged 12-18 from diverse backgrounds, particularly those in underrepresented communities. We provide transportation assistance and flexible scheduling to remove barriers to participation.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-black dark:text-white">Program Impact</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Since its inception, the Michelle Obama Empowerment Academy has transformed the lives of countless young people, providing them with the confidence, skills, and networks necessary to pursue higher education, meaningful careers, and active community involvement. Our participants consistently demonstrate improved academic performance, enhanced leadership capabilities, and stronger commitment to healthy lifestyle choices.
        </p>

        <div class="mt-8 p-6 bg-primary bg-opacity-10 rounded-lg">
          <p class="text-base font-medium text-primary mb-2">Join Our Program</p>
          <p class="text-base text-body-color">
            Contact us to learn about upcoming sessions and how to get involved in the Michelle Obama Empowerment Academy.
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
