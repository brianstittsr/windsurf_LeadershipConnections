import { Program } from "@/types/program";

const programsData: Program[] = [
  {
    id: 1,
    title: "Leadership Development Program",
    paragraph: "Our flagship program designed to cultivate leadership skills through personalized coaching and practical exercises.",
    image: "/images/programs/leadership-development.jpg",
    author: {
      name: "Dr. Sarah Johnson",
      image: "/images/blog/author-01.png",
      designation: "Program Director",
    },
    tags: ["Leadership", "Development", "Coaching"],
    publishDate: "Jan 10, 2025",
    slug: "leadership-development-program",
    content: `
      <div class="blog-details">
        <h3>Leadership Development Program</h3>
        <p>The Leadership Development Program is designed for emerging and established leaders who want to enhance their leadership capabilities and make a greater impact in their organizations and communities.</p>
        
        <h4>Program Overview</h4>
        <p>This comprehensive 12-week program combines theoretical learning with practical application, allowing participants to develop and refine their leadership skills in real-world scenarios.</p>
        
        <h4>Key Components</h4>
        <ul>
          <li><strong>Personal Leadership Assessment:</strong> Identify your leadership style and areas for growth</li>
          <li><strong>One-on-One Coaching:</strong> Regular sessions with experienced leadership coaches</li>
          <li><strong>Group Workshops:</strong> Collaborative learning with peers facing similar challenges</li>
          <li><strong>Action Learning Projects:</strong> Apply new skills to real organizational challenges</li>
          <li><strong>Networking Opportunities:</strong> Connect with alumni and industry leaders</li>
        </ul>
        
        <h4>Who Should Attend</h4>
        <p>This program is ideal for:</p>
        <ul>
          <li>Mid-level managers looking to advance to senior positions</li>
          <li>New managers transitioning into leadership roles</li>
          <li>Entrepreneurs building and leading teams</li>
          <li>Community leaders seeking to increase their effectiveness</li>
        </ul>
        
        <h4>Expected Outcomes</h4>
        <p>By the end of the program, participants will:</p>
        <ul>
          <li>Develop a personal leadership philosophy and action plan</li>
          <li>Enhance communication and conflict resolution skills</li>
          <li>Build effective teams and foster collaboration</li>
          <li>Learn to lead through change and uncertainty</li>
          <li>Strengthen strategic thinking and decision-making abilities</li>
        </ul>
        
        <h4>Registration Information</h4>
        <p>The next cohort begins on March 15, 2025. Early registration is recommended as spaces are limited to ensure a personalized experience for all participants.</p>
      </div>
    `,
  },
  {
    id: 2,
    title: "Executive Coaching Program",
    paragraph: "One-on-one coaching for executives looking to overcome specific challenges and reach their full leadership potential.",
    image: "/images/programs/executive-coaching.jpg",
    author: {
      name: "Michael Chen",
      image: "/images/blog/author-02.png",
      designation: "Executive Coach",
    },
    tags: ["Executive", "Coaching", "Leadership"],
    publishDate: "Feb 05, 2025",
    slug: "executive-coaching-program",
    content: `
      <div class="blog-details">
        <h3>Executive Coaching Program</h3>
        <p>Our Executive Coaching Program provides personalized, one-on-one coaching for senior leaders facing complex challenges in today's rapidly changing business environment.</p>
        
        <h4>Program Overview</h4>
        <p>This tailored coaching experience is designed to help executives enhance their leadership effectiveness, navigate organizational challenges, and achieve both personal and professional goals.</p>
        
        <h4>Key Components</h4>
        <ul>
          <li><strong>Comprehensive Assessment:</strong> In-depth evaluation of leadership style, strengths, and development areas</li>
          <li><strong>Customized Coaching Plan:</strong> Tailored to address specific challenges and objectives</li>
          <li><strong>Regular Coaching Sessions:</strong> Bi-weekly meetings with an experienced executive coach</li>
          <li><strong>360-Degree Feedback:</strong> Insights from colleagues, direct reports, and supervisors</li>
          <li><strong>Progress Tracking:</strong> Regular evaluation of development and goal achievement</li>
        </ul>
        
        <h4>Who Should Participate</h4>
        <p>This program is ideal for:</p>
        <ul>
          <li>C-suite executives and senior leaders</li>
          <li>High-potential leaders being groomed for executive positions</li>
          <li>Leaders navigating significant organizational change</li>
          <li>Executives seeking to enhance specific leadership competencies</li>
        </ul>
        
        <h4>Expected Outcomes</h4>
        <p>Participants in the Executive Coaching Program typically experience:</p>
        <ul>
          <li>Enhanced leadership presence and influence</li>
          <li>Improved strategic thinking and decision-making</li>
          <li>Greater self-awareness and emotional intelligence</li>
          <li>More effective communication with stakeholders at all levels</li>
          <li>Better work-life integration and stress management</li>
        </ul>
        
        <h4>Program Details</h4>
        <p>The Executive Coaching Program runs for six months, with the option to extend based on individual needs and goals. Coaching sessions can be conducted in person or virtually to accommodate busy executive schedules.</p>
      </div>
    `,
  },
  {
    id: 3,
    title: "Team Building Workshop Series",
    paragraph: "Interactive workshops designed to strengthen team dynamics, improve communication, and enhance collaboration.",
    image: "/images/programs/team-building.jpg",
    author: {
      name: "Lisa Rodriguez",
      image: "/images/blog/author-03.png",
      designation: "Team Development Specialist",
    },
    tags: ["Team Building", "Collaboration", "Communication"],
    publishDate: "Mar 22, 2025",
    slug: "team-building-workshop-series",
    content: `
      <div class="blog-details">
        <h3>Team Building Workshop Series</h3>
        <p>Our Team Building Workshop Series is designed to transform groups of individuals into high-performing teams through structured activities, facilitated discussions, and practical tools.</p>
        
        <h4>Program Overview</h4>
        <p>This series consists of four interconnected workshops that build upon each other to develop essential team capabilities. Each workshop can be delivered as a half-day or full-day session, depending on your team's needs and schedule.</p>
        
        <h4>Workshop Topics</h4>
        <ol>
          <li>
            <strong>Building Trust and Psychological Safety</strong>
            <p>Establish the foundation for effective teamwork by creating an environment where team members feel safe to take risks, share ideas, and be vulnerable with one another.</p>
          </li>
          <li>
            <strong>Mastering Productive Conflict</strong>
            <p>Learn to engage in healthy, ideological debate focused on finding the best solutions rather than protecting egos or avoiding difficult conversations.</p>
          </li>
          <li>
            <strong>Developing Accountability and Commitment</strong>
            <p>Create clear expectations, foster buy-in, and establish mechanisms for mutual accountability to ensure follow-through on team decisions.</p>
          </li>
          <li>
            <strong>Achieving Collective Results</strong>
            <p>Align individual and team goals to focus on shared outcomes and celebrate collective achievements rather than individual successes.</p>
          </li>
        </ol>
        
        <h4>Who Should Participate</h4>
        <p>This workshop series is ideal for:</p>
        <ul>
          <li>Newly formed teams establishing their working relationships</li>
          <li>Existing teams facing challenges or undergoing significant changes</li>
          <li>Cross-functional teams working on important projects</li>
          <li>Leadership teams seeking to model effective collaboration</li>
        </ul>
        
        <h4>Expected Outcomes</h4>
        <p>Teams that complete the workshop series typically experience:</p>
        <ul>
          <li>Improved communication and reduced misunderstandings</li>
          <li>More efficient meetings and decision-making processes</li>
          <li>Increased innovation through better collaboration</li>
          <li>Higher levels of engagement and job satisfaction</li>
          <li>Enhanced ability to adapt to change and overcome challenges</li>
        </ul>
        
        <h4>Customization Options</h4>
        <p>While the core framework remains consistent, each workshop is customized based on a pre-assessment of your team's specific dynamics, challenges, and goals to ensure maximum relevance and impact.</p>
      </div>
    `,
  },
  {
    id: 4,
    title: "Emerging Leaders Mentorship Program",
    paragraph: "A structured mentorship program pairing high-potential individuals with experienced leaders to accelerate professional growth.",
    image: "/images/programs/mentorship.jpg",
    author: {
      name: "James Wilson",
      image: "/images/blog/author-04.png",
      designation: "Mentorship Coordinator",
    },
    tags: ["Mentorship", "Career Development", "Leadership"],
    publishDate: "Apr 15, 2025",
    slug: "emerging-leaders-mentorship-program",
    content: `
      <div class="blog-details">
        <h3>Emerging Leaders Mentorship Program</h3>
        <p>The Emerging Leaders Mentorship Program connects promising professionals with experienced leaders to foster growth, provide guidance, and accelerate career development through structured mentoring relationships.</p>
        
        <h4>Program Overview</h4>
        <p>This nine-month program creates meaningful mentoring partnerships that benefit both mentees seeking to advance their careers and mentors looking to share their wisdom and develop their coaching skills.</p>
        
        <h4>Key Components</h4>
        <ul>
          <li><strong>Thoughtful Matching Process:</strong> Pairing mentees with mentors based on career goals, skills, and personal styles</li>
          <li><strong>Structured Framework:</strong> Clear guidelines and milestones to ensure productive mentoring relationships</li>
          <li><strong>Regular One-on-One Sessions:</strong> Monthly meetings focused on the mentee's development goals</li>
          <li><strong>Learning Cohorts:</strong> Quarterly group sessions where mentees can learn from each other's experiences</li>
          <li><strong>Development Resources:</strong> Access to tools, assessments, and learning materials to support growth</li>
        </ul>
        
        <h4>Who Should Participate</h4>
        <p><strong>As a Mentee:</strong></p>
        <ul>
          <li>High-potential professionals with 3-7 years of experience</li>
          <li>Individuals seeking to transition into leadership roles</li>
          <li>Those looking to navigate career challenges or transitions</li>
          <li>Professionals wanting to expand their organizational knowledge and network</li>
        </ul>
        
        <p><strong>As a Mentor:</strong></p>
        <ul>
          <li>Experienced leaders passionate about developing others</li>
          <li>Professionals with valuable insights and lessons to share</li>
          <li>Leaders looking to enhance their coaching and development skills</li>
          <li>Individuals seeking to give back to their professional community</li>
        </ul>
        
        <h4>Expected Outcomes</h4>
        <p><strong>For Mentees:</strong></p>
        <ul>
          <li>Accelerated professional growth and skill development</li>
          <li>Expanded professional network and visibility</li>
          <li>Greater confidence in navigating career challenges</li>
          <li>Clearer vision for career progression and leadership development</li>
        </ul>
        
        <p><strong>For Mentors:</strong></p>
        <ul>
          <li>Enhanced leadership and coaching abilities</li>
          <li>Fresh perspectives on organizational challenges</li>
          <li>Satisfaction from contributing to others' development</li>
          <li>Opportunity to reflect on and articulate their own leadership philosophy</li>
        </ul>
        
        <h4>Application Process</h4>
        <p>Applications for both mentees and mentors open twice yearly, in January and July. The selection process includes an application form, interviews, and assessments to ensure appropriate matching and commitment to the program.</p>
      </div>
    `,
  },
  {
    id: 5,
    title: "Summer 'College Experience'",
    paragraph: "An immersive week-long residential program that gives young women a taste of college life while building independence and academic skills.",
    image: "/images/programs/college-experience.jpg",
    author: {
      name: "Katherine Harreleson",
      image: "/images/blog/author-01.png",
      designation: "Program Director",
    },
    tags: ["Education", "College Prep", "Youth Development"],
    publishDate: "Mar 15, 2025",
    slug: "summer-college-experience",
    content: `
      <div class="blog-details">
        <h3>Summer 'College Experience' Program</h3>
        <p>The Summer 'College Experience' is a transformative week-long residential program designed to give young women a realistic preview of college life while developing crucial independence and academic skills.</p>
        
        <h4>Program Overview</h4>
        <p>Participants stay in actual college dormitories, attend workshops taught by university professors, and engage in campus activities that mirror the authentic college experience. This immersive opportunity helps demystify higher education and builds confidence in navigating university life.</p>
        
        <h4>Key Components</h4>
        <ul>
          <li><strong>Campus Living:</strong> Experience dormitory life, dining halls, and campus navigation</li>
          <li><strong>Academic Workshops:</strong> Participate in college-level classes across various disciplines</li>
          <li><strong>Study Skills Development:</strong> Learn effective note-taking, time management, and research techniques</li>
          <li><strong>College Application Guidance:</strong> Receive expert advice on admissions, essays, and financial aid</li>
          <li><strong>Networking:</strong> Connect with current college students, professors, and admissions officers</li>
        </ul>
        
        <h4>Who Should Attend</h4>
        <p>This program is ideal for:</p>
        <ul>
          <li>High school students in grades 9-12</li>
          <li>Young women interested in pursuing higher education</li>
          <li>Students who would be first-generation college attendees</li>
          <li>Those seeking clarity on their academic and career paths</li>
        </ul>
        
        <h4>Expected Outcomes</h4>
        <p>By the end of the program, participants will:</p>
        <ul>
          <li>Develop increased confidence in their ability to succeed in college</li>
          <li>Gain practical skills for academic success</li>
          <li>Better understand the college application process</li>
          <li>Form connections with mentors and peers in higher education</li>
          <li>Create a personalized college preparation action plan</li>
        </ul>
        
        <h4>Program Details</h4>
        <p><strong>Duration:</strong> 7 days (residential)<br>
        <strong>Location:</strong> Partner university campus<br>
        <strong>Includes:</strong> Accommodation, meals, all workshops and materials<br>
        <strong>Application:</strong> Required (competitive selection process)</p>
      </div>
    `,
  },
  {
    id: 6,
    title: "Inter-Generational Networking",
    paragraph: "A unique program that bridges generational gaps by connecting young women with established professionals across different age groups for mentorship and knowledge exchange.",
    image: "/images/programs/inter-generational.jpg",
    author: {
      name: "Gloria Bass",
      image: "/images/blog/author-02.png",
      designation: "Leadership Coach",
    },
    tags: ["Networking", "Mentorship", "Professional Development"],
    publishDate: "Feb 20, 2025",
    slug: "inter-generational-networking",
    content: `
      <div class="blog-details">
        <h3>Inter-Generational Networking Program</h3>
        <p>The Inter-Generational Networking program creates meaningful connections across age groups, facilitating knowledge transfer, mentorship, and mutual learning between generations of professional women.</p>
        
        <h4>Program Overview</h4>
        <p>This innovative initiative brings together women at different career stages—from students to retirees—to share experiences, wisdom, and fresh perspectives. Through structured interactions and collaborative projects, participants develop cross-generational understanding and build valuable professional relationships.</p>
        
        <h4>Key Components</h4>
        <ul>
          <li><strong>Mentorship Circles:</strong> Small groups with representatives from different generations</li>
          <li><strong>Skills Exchange:</strong> Workshops where each generation shares their unique expertise</li>
          <li><strong>Collaborative Projects:</strong> Cross-generational teams addressing community challenges</li>
          <li><strong>Networking Events:</strong> Structured opportunities to build meaningful connections</li>
          <li><strong>Digital Literacy:</strong> Bridging technology gaps between generations</li>
        </ul>
        
        <h4>Who Should Attend</h4>
        <p>This program welcomes women of all ages, including:</p>
        <ul>
          <li>High school and college students seeking career guidance</li>
          <li>Early-career professionals looking for mentorship</li>
          <li>Mid-career women interested in both mentoring and being mentored</li>
          <li>Senior professionals and retirees wanting to share their wisdom</li>
          <li>Women re-entering the workforce after career breaks</li>
        </ul>
        
        <h4>Expected Outcomes</h4>
        <p>By participating in this program, women will:</p>
        <ul>
          <li>Develop meaningful cross-generational professional relationships</li>
          <li>Gain diverse perspectives on career challenges and opportunities</li>
          <li>Learn both traditional wisdom and cutting-edge approaches</li>
          <li>Expand their professional networks across age groups</li>
          <li>Contribute to creating more inclusive workplaces</li>
        </ul>
        
        <h4>Program Details</h4>
        <p><strong>Duration:</strong> 6 months with monthly meetings<br>
        <strong>Format:</strong> Combination of in-person and virtual sessions<br>
        <strong>Application:</strong> Open to women of all ages and career stages</p>
      </div>
    `,
  },
  {
    id: 7,
    title: "Michelle Obama Empowerment Cafe",
    paragraph: "A series of inspiring discussion forums inspired by Michelle Obama's principles of empowerment, education, and community service.",
    image: "/images/programs/empowerment-cafe.jpg",
    author: {
      name: "Katherine Harreleson",
      image: "/images/blog/author-01.png",
      designation: "Program Director",
    },
    tags: ["Empowerment", "Leadership", "Community"],
    publishDate: "Jan 25, 2025",
    slug: "michelle-obama-empowerment-cafe",
    content: `
      <div class="blog-details">
        <h3>Michelle Obama Empowerment Cafe</h3>
        <p>The Michelle Obama Empowerment Cafe is a dynamic forum inspired by the former First Lady's commitment to education, healthy living, service, and empowerment of young women.</p>
        
        <h4>Program Overview</h4>
        <p>This program creates a welcoming space where participants engage in meaningful discussions, explore personal growth opportunities, and develop action plans for positive change in their lives and communities. Each session focuses on themes central to Michelle Obama's vision of empowerment.</p>
        
        <h4>Key Components</h4>
        <ul>
          <li><strong>Book Club Discussions:</strong> Exploring empowering literature, including Michelle Obama's works</li>
          <li><strong>Guest Speaker Series:</strong> Featuring successful women from diverse backgrounds</li>
          <li><strong>Community Service Projects:</strong> Putting empowerment principles into action</li>
          <li><strong>Personal Development Workshops:</strong> Building confidence, communication, and leadership skills</li>
          <li><strong>Healthy Living Initiatives:</strong> Promoting physical and mental wellbeing</li>
        </ul>
        
        <h4>Who Should Attend</h4>
        <p>This program welcomes:</p>
        <ul>
          <li>Young women seeking inspiration and guidance</li>
          <li>Community members interested in personal growth</li>
          <li>Individuals passionate about service and giving back</li>
          <li>Those looking to expand their networks with like-minded people</li>
          <li>Anyone inspired by Michelle Obama's message of hope and empowerment</li>
        </ul>
        
        <h4>Expected Outcomes</h4>
        <p>Participants will:</p>
        <ul>
          <li>Develop a stronger sense of personal purpose and direction</li>
          <li>Build practical skills for leadership and community engagement</li>
          <li>Create meaningful connections with peers and mentors</li>
          <li>Contribute to positive change in their communities</li>
          <li>Gain inspiration from Michelle Obama's example and philosophy</li>
        </ul>
        
        <h4>Program Details</h4>
        <p><strong>Format:</strong> Monthly cafe-style gatherings<br>
        <strong>Location:</strong> Community centers and partner locations<br>
        <strong>Participation:</strong> Open to all, with a focus on young women ages 14-25</p>
      </div>
    `,
  },
  {
    id: 8,
    title: "Red Carpet Kids",
    paragraph: "A confidence-building program that celebrates young achievers through special events that recognize their talents, accomplishments, and potential.",
    image: "/images/programs/red-carpet-kids.jpg",
    author: {
      name: "Gloria Bass",
      image: "/images/blog/author-02.png",
      designation: "Leadership Coach",
    },
    tags: ["Youth", "Confidence", "Recognition"],
    publishDate: "Apr 5, 2025",
    slug: "red-carpet-kids",
    content: `
      <div class="blog-details">
        <h3>Red Carpet Kids Program</h3>
        <p>Red Carpet Kids is a unique recognition program that celebrates the achievements, talents, and potential of young people through glamorous red carpet events and ongoing development activities.</p>
        
        <h4>Program Overview</h4>
        <p>This program creates special moments that spotlight young achievers, building their confidence and motivation while providing opportunities for personal growth. Through a combination of celebratory events and skill-building workshops, participants develop poise, public speaking abilities, and leadership qualities.</p>
        
        <h4>Key Components</h4>
        <ul>
          <li><strong>Red Carpet Celebrations:</strong> Formal events where young people are celebrated like stars</li>
          <li><strong>Achievement Recognition:</strong> Acknowledging academic, artistic, athletic, and community service accomplishments</li>
          <li><strong>Media Skills:</strong> Training in interviews, public speaking, and positive self-presentation</li>
          <li><strong>Leadership Development:</strong> Workshops on confidence, goal-setting, and personal branding</li>
          <li><strong>Community Showcase:</strong> Opportunities to share talents and achievements with the wider community</li>
        </ul>
        
        <h4>Who Should Participate</h4>
        <p>This program is designed for:</p>
        <ul>
          <li>Young people ages 8-18 who have demonstrated excellence in any area</li>
          <li>Students who have overcome significant challenges</li>
          <li>Youth who have made positive contributions to their communities</li>
          <li>Young people who would benefit from confidence-building experiences</li>
          <li>Children and teens from underserved communities whose achievements often go unrecognized</li>
        </ul>
        
        <h4>Expected Outcomes</h4>
        <p>Through participation, young people will:</p>
        <ul>
          <li>Experience increased self-confidence and positive self-image</li>
          <li>Develop public speaking and media interaction skills</li>
          <li>Build a supportive peer network of fellow achievers</li>
          <li>Gain motivation to continue pursuing excellence</li>
          <li>Learn to celebrate their own accomplishments and those of others</li>
        </ul>
        
        <h4>Program Details</h4>
        <p><strong>Events:</strong> Quarterly red carpet celebrations<br>
        <strong>Workshops:</strong> Monthly skill-building sessions<br>
        <strong>Nomination Process:</strong> Young people can be nominated by teachers, community leaders, or parents<br>
        <strong>Recognition:</strong> All participants receive personalized recognition and development opportunities</p>
      </div>
    `,
  }
];

export default programsData;
