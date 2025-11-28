import { Blog } from "@/types/blog";

const blogData: Blog[] = [
  // Note: "health-and-fitness-for-youth" has been moved to Firestore
  // and is managed through the admin panel at /admin/blog-entries
  {
    id: 2,
    slug: "steem-building-futures",
    title: "Introducing STEEM: Building Futures through Technology",
    paragraph:
      "In an age where technology is rapidly evolving, the STEEM program is at the forefront of equipping youth with the skills and knowledge to thrive in this digital landscape through innovative workshops in robotics, coding, and creative entrepreneurship.",
    image: "/images/cellphone_images/5822257108524370710.jpg",
    author: {
      name: "Brian Stitt",
      image: "/images/logo/LeadershipConnectionsLogo.png",
      designation: "Leadership Coach",
    },
    tags: ["STEEM", "Technology"],
    publishDate: "2023-01-01",
    content: `
      <p class="mb-6 text-base leading-relaxed text-body-color">
        In an age where technology is rapidly evolving, the importance of equipping our youth with the skills and knowledge to thrive in this digital landscape cannot be overstated. The STEEM (Science, Technology, Engineering, Entrepreneurship, and Mathematics) program is at the forefront of this mission, providing innovative workshops that inspire and empower the next generation of innovators. Through hands-on experiences in robotics, coding, and creative entrepreneurship, STEEM is shaping a future where youth can explore their passions and build successful careers in technology.
      </p>

      <h3 class="mb-4 text-xl font-bold text-primary-600 dark:text-primary-400 sm:text-2xl">Shaping Innovators through Hands-On Learning</h3>
      <p class="mb-6 text-base leading-relaxed text-body-color">
        The STEEM program is designed to engage students in a dynamic learning environment where they can actively participate in various workshops. These workshops focus on practical applications of STEEM concepts, allowing participants to dive into exciting projects that spark their creativity and curiosity. By working on real-world challenges, students develop critical thinking and problem-solving skills that are essential for success in today's technology-driven world.
      </p>

      <div class="mb-10 w-full overflow-hidden rounded">
        <img src="/images/cellphone_images/8489697603616538147.jpg" alt="Students engaged in STEEM workshop" class="w-full object-cover" />
      </div>

      <h3 class="mb-4 text-xl font-bold text-primary-600 dark:text-primary-400 sm:text-2xl">Exploring the World of Robotics</h3>
      <p class="mb-6 text-base leading-relaxed text-body-color">
        One of the standout features of the STEEM program is its emphasis on robotics. Through interactive robotics workshops, youth learn the fundamentals of designing, building, and programming robots. Participants gain hands-on experience with coding languages and robotics kits, allowing them to bring their creations to life. This hands-on approach not only makes learning fun but also instills a sense of accomplishment as students see their ideas transform into functioning robots.
      </p>

      <h3 class="mb-4 text-xl font-bold text-primary-600 dark:text-primary-400 sm:text-2xl">Unleashing Creativity with Coding</h3>
      <p class="mb-6 text-base leading-relaxed text-body-color">
        Coding is a vital skill in the modern workforce, and the STEEM program ensures that youth are well-equipped to navigate this digital landscape. Workshops focused on coding introduce participants to various programming languages and platforms, enabling them to create their own applications and games. By fostering a love for coding, STEEM encourages youth to think critically and creatively, empowering them to express themselves through technology.
      </p>

      <div class="mb-10 w-full overflow-hidden rounded">
        <img src="/images/cellphone_images/5822257108524370710.jpg" alt="Youth learning coding and technology" class="w-full object-cover" />
      </div>

      <h3 class="mb-4 text-xl font-bold text-primary-600 dark:text-primary-400 sm:text-2xl">Creative Entrepreneurship: Turning Ideas into Reality</h3>
      <p class="mb-6 text-base leading-relaxed text-body-color">
        In addition to technical skills, the STEEM program emphasizes the importance of entrepreneurship. Workshops on creative entrepreneurship teach participants how to turn their innovative ideas into viable business ventures. Youth learn about market research, business planning, and marketing strategies, giving them the tools they need to launch their own projects. This entrepreneurial mindset not only fosters independence but also encourages students to pursue their passions and contribute to their communities.
      </p>

      <h3 class="mb-4 text-xl font-bold text-primary-600 dark:text-primary-400 sm:text-2xl">Encouraging Passion and Exploration</h3>
      <p class="mb-6 text-base leading-relaxed text-body-color">
        At the heart of the STEEM program is the belief that every young person has the potential to be an innovator. By providing a supportive and encouraging environment, STEEM allows youth to explore their interests in technology without fear of failure. Participants are inspired to take risks, experiment, and learn from their experiences, ultimately leading to personal growth and development.
      </p>

      <h3 class="mb-4 text-xl font-bold text-primary-600 dark:text-primary-400 sm:text-2xl">Building a Brighter Future</h3>
      <p class="mb-6 text-base leading-relaxed text-body-color">
        As we look to the future, it is clear that technology will continue to play a pivotal role in shaping our world. The STEEM program is dedicated to ensuring that the next generation is not only consumers of technology but also creators and innovators. By equipping youth with the skills and confidence to pursue their passions, STEEM is building a brighter future where young individuals can thrive in a rapidly changing landscape.
      </p>

      <h3 class="mb-4 text-xl font-bold text-primary-600 dark:text-primary-400 sm:text-2xl">Conclusion</h3>
      <p class="mb-6 text-base leading-relaxed text-body-color">
        Introducing STEEM: Building Futures through Technology is more than just a program; it is a movement to inspire and empower youth. Through engaging workshops in robotics, coding, and creative entrepreneurship, STEEM is shaping the next generation of innovators who will lead us into the future. Let's support our youth in exploring their passions for technology and encourage them to become the leaders of tomorrow. Together, we can build a world where creativity and innovation know no bounds.
      </p>
    `,
  },
  {
    id: 3,
    slug: "crafting-skills-in-trades",
    title: "Crafting Skills in the Trades: Building, Designing, and Creating",
    paragraph:
      "Join us as we highlight the importance of trades education. Uncover how hands-on experience in construction, design, and craftsmanship can prepare youth for rewarding career paths.",
    image: "/images/cellphone_images/6326587696750049260.JPG",
    author: {
      name: "Gloria Bass",
      image: "/images/history/GloriaBass.webp",
      designation: "Program Director",
    },
    tags: ["Trades", "Education"],
    publishDate: "2023-01-01",
  },
];
export default blogData;
