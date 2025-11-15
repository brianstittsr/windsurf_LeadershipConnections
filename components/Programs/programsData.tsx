import { Program } from "@/types/program";

const programsData: Program[] = [
  {
    id: 1,
    title: "Red Carpet Kids USA",
    paragraph: "Inspiring youth through fitness, creativity, and leadership, Red Carpet Kids USA engages participants in activities designed to promote wellness and self-advocacy while giving back to their communities.",
    image: "/images/logos/RedCarpetKidsUSA-Logomark-Logo-FullColor-JPG.jpg",
    author: {
      name: "Katherine Harreleson",
      image: "/images/blog/author-01.png",
      designation: "Program Director",
    },
    tags: ["Youth", "Fitness", "Creativity"],
    publishDate: "2023-01-01",
    slug: "red-carpet-kids-usa",
    content: `
      <div class="program-content">
        <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">Overview</h3>
        
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Red Carpet Kids (RCK) is an innovative program designed to empower youth through a comprehensive approach that integrates fitness, wellness, and community engagement. This initiative aims to foster leadership, enhance self-esteem, and promote healthy lifestyles among children from diverse backgrounds.
        </p>

        <div class="mb-10 w-full overflow-hidden rounded">
          <img src="/images/RKK_MLK_Choir.png" alt="Red Carpet Kids MLK Choir" class="w-full h-auto rounded" />
        </div>

        <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">Mission</h3>
        
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The mission of Red Carpet Kids is to equip young individuals with the knowledge, skills, and leadership abilities necessary to effect positive change in their communities. By focusing on physical fitness, nutritional education, and personal development, RCK strives to ensure that no child faces hunger or lacks the support needed to thrive.
        </p>

        <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">Core Components</h3>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Let's Move Fitness Initiative</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Inspired by Michelle Obama's Let's Move campaign, this component encourages children to engage in regular physical activity. Through fun and interactive fitness programs, participants learn the importance of staying active and maintaining a healthy lifestyle.
        </p>

        <div class="mb-10 w-full overflow-hidden rounded">
          <img src="/images/programs/Michelle-Obama-Empowerment-Academy/RCK_Firebirds_spring2024/Screenshot-2025-10-31-005307.png" alt="Red Carpet Kids Firebirds" class="w-full h-auto rounded" />
        </div>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Youth Empowerment Café</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The Youth Empowerment Café serves as a safe space for young people to gather, learn, and share ideas. This café provides nutritious meals and snacks while offering workshops on healthy eating, cooking skills, and nutrition education. It also serves as a hub for mentorship and community building.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Community Juvenile Prevention Cadet Club</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          This club focuses on leadership development and community service. Participants engage in activities that promote civic responsibility, teamwork, and problem-solving skills. The club aims to prevent juvenile delinquency by providing positive role models and constructive activities.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Education and Training</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          RCK offers various educational programs that cover topics such as nutrition, health, leadership, and personal development. These programs are designed to empower youth with the knowledge and skills they need to make informed decisions about their health and well-being.
        </p>

        <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">Implementation Timeline</h3>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The Red Carpet Kids program is implemented throughout the year with seasonal activities and workshops. Regular fitness sessions, café gatherings, and community service projects are scheduled to ensure continuous engagement and development of participating youth.
        </p>

        <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">Impact Goals</h3>
        <ul class="mb-6 list-disc list-inside text-base leading-relaxed text-body-color space-y-2">
          <li>Increase physical activity levels among participating youth</li>
          <li>Improve nutritional knowledge and healthy eating habits</li>
          <li>Develop leadership skills and civic responsibility</li>
          <li>Reduce food insecurity in underserved communities</li>
          <li>Foster positive peer relationships and community connections</li>
          <li>Prevent juvenile delinquency through positive engagement</li>
        </ul>

        <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">Get Involved</h3>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Join us in making a difference! If you are interested in supporting the Red Carpet Kids program, whether through volunteering, donations, or partnership opportunities, please <a href="/get-involved" class="text-primary-600 hover:text-primary-700 underline">click here to get involved</a>.
        </p>

        <div class="mt-8 p-6 bg-primary bg-opacity-10 rounded-lg">
          <p class="text-base font-medium text-primary mb-2">Conclusion</p>
          <p class="text-base text-body-color">
            Red Carpet Kids, USA is more than just a program; it is a movement to inspire the next generation of leaders. Through a blend of fitness, nutrition, and community engagement, RCK is dedicated to building stronger, healthier communities, ensuring that every child has the opportunity to succeed and thrive.
          </p>
        </div>
      </div>
    `,
  },
  {
    id: 2,
    title: "Michelle Obama Empowerment Academy",
    paragraph: "This initiative empowers young people through leadership training and health education, providing them with the tools they need to succeed while cultivating a culture of health and well-being.",
    image: "/images/MichelleObamaLetsMove.png",
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
        <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">Program Goals</h3>
        
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The Michelle Obama Empowerment Academy empowers young people through leadership training and health education, providing them with the tools they need to succeed while cultivating a culture of health and well-being.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Our Objectives</h4>
        <ul class="mb-6 list-disc list-inside text-base leading-relaxed text-body-color space-y-2">
          <li>Develop leadership skills through interactive workshops and peer mentoring</li>
          <li>Promote health and wellness education covering nutrition, fitness, and mental health</li>
          <li>Foster community engagement through service projects and civic activities</li>
          <li>Build self-esteem and communication skills in young participants</li>
          <li>Connect students with professional mentors in their fields of interest</li>
        </ul>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Community Outreach</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          We actively reach out to underserved communities to ensure equal access to our programs. Our outreach efforts focus on connecting with schools, community centers, and local organizations to identify young people who would benefit most from our leadership development opportunities.
        </p>

        <p class="mb-6 text-base leading-relaxed text-body-color">
          The academy welcomes young people aged 12-18 from diverse backgrounds, particularly those in underrepresented communities. We provide transportation assistance and flexible scheduling to remove barriers to participation.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Program Impact</h4>
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
    image: "/images/programs/steem_Academy_Warnersville/STEEM Academy_v2.png",
    author: {
      name: "Katherine Harreleson",
      image: "/images/blog/author-01.png",
      designation: "Program Director",
    },
    tags: ["STEEM", "Technology", "Workforce"],
    publishDate: "2023-01-01",
    slug: "steem-workforce-development-center",
    content: `
      <div class="program-content">
        <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">Overview</h3>
        
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The STEEM (Science, Technology, Engineering, Entrepreneurship, and Mathematics) program is a dynamic initiative designed to empower youth through hands-on learning experiences in the fields of science and technology. By integrating critical thinking, creativity, and problem-solving skills, the STEEM program aims to prepare participants for future careers in high-demand industries while fostering a passion for innovation and entrepreneurship.
        </p>

        <div class="mb-10 w-full overflow-hidden rounded">
          <video controls controlsList="nodownload" preload="metadata" class="w-full h-auto rounded bg-black">
            <source src="/images/programs/steem_Academy_Warnersville/STEEM Academy - Warnersville.MOV" type="video/quicktime" />
            <source src="/images/programs/steem_Academy_Warnersville/STEEM Academy - Warnersville.MOV" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">Mission</h3>
        
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The mission of the STEEM program is to equip young individuals with the essential skills and knowledge needed to thrive in a rapidly evolving technological landscape. Through engaging workshops and experiential learning opportunities, the program seeks to inspire youth to pursue careers in STEEM fields and become leaders in their communities.
        </p>

        <div class="mb-10 w-full overflow-hidden rounded">
          <img src="/images/programs/Welborn/Robo Dog - Welborn.jpg" alt="STEEM Robotics - Robo Dog" class="w-full h-auto rounded" />
        </div>

        <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">Core Components</h3>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Workshops and Training</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The STEEM program offers a variety of hands-on workshops that cover topics such as robotics, coding, 3D printing, and engineering design. These interactive sessions provide participants with practical skills and real-world applications of STEEM concepts, encouraging them to explore their interests and develop their talents.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Entrepreneurship Development</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Participants learn the fundamentals of entrepreneurship, including business planning, marketing, and financial literacy. The program encourages youth to think creatively about how they can turn their ideas into viable business ventures, fostering an entrepreneurial mindset that will serve them throughout their lives.
        </p>

        <div class="mb-10 w-full overflow-hidden rounded">
          <img src="/images/programs/steem_Academy_Warnersville/STEEM Academy - Warnersville v4.jpg" alt="STEEM Academy Warnersville" class="w-full h-auto rounded" />
        </div>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Collaboration and Teamwork</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The STEEM program emphasizes the importance of collaboration and teamwork. Participants work together on projects, learning to communicate effectively, share ideas, and support one another in achieving common goals. These collaborative experiences prepare youth for success in both academic and professional settings.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Mentorship and Guidance</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          Experienced professionals and educators serve as mentors, providing guidance and support to participants throughout their STEEM journey. These mentors share their expertise, offer career advice, and help youth navigate the challenges of pursuing careers in STEEM fields.
        </p>

        <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Community Engagement</h4>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The program encourages participants to engage with their communities through service projects and outreach initiatives. By applying their STEEM skills to address local challenges, youth learn the value of giving back and making a positive impact in their neighborhoods.
        </p>

        <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">Implementation Timeline</h3>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          The STEEM program runs year-round with seasonal workshops, summer intensives, and after-school sessions. Regular hands-on activities, project-based learning experiences, and mentorship meetings are scheduled to ensure continuous skill development and engagement of participating youth.
        </p>

        <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">Impact Goals</h3>
        <ul class="mb-6 list-disc list-inside text-base leading-relaxed text-body-color space-y-2">
          <li>Increase interest and proficiency in STEEM subjects among participating youth</li>
          <li>Develop critical thinking, problem-solving, and innovation skills</li>
          <li>Prepare students for careers in high-demand technology and engineering fields</li>
          <li>Foster entrepreneurial mindsets and business acumen</li>
          <li>Build confidence in applying STEEM knowledge to real-world challenges</li>
          <li>Create pathways to higher education and career opportunities in STEEM</li>
        </ul>

        <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">Get Involved</h3>
        <p class="mb-6 text-base leading-relaxed text-body-color">
          If you are interested in supporting the STEEM program, whether through volunteering, mentorship, or partnership opportunities, please <a href="/get-involved" class="text-primary-600 hover:text-primary-700 underline">click here to get involved</a>.
        </p>

        <div class="mt-8 p-6 bg-primary bg-opacity-10 rounded-lg">
          <p class="text-base font-medium text-primary mb-2">Conclusion</p>
          <p class="text-base text-body-color">
            The STEEM program is a vital initiative dedicated to shaping the next generation of innovators and leaders. By providing youth with the tools and experiences necessary to excel in science, technology, engineering, and mathematics, the program is committed to building a brighter future for individuals and communities alike.
          </p>
        </div>
      </div>
    `,
  },
];

export default programsData;
