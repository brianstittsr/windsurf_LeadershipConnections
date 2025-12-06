import { Blog } from "@/types/blog";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Extended blog data with real content and slugs
const blogData: (Blog & { slug: string; content: string })[] = [
  {
    id: 1,
    slug: "leadership-journey-begins",
    title: "Your Leadership Journey Begins Here",
    paragraph:
      "Discover how the Leadership C.O.N.N.E.C.T.I.O.N.S. Program can transform your future through mentorship, skill development, and community engagement.",
    image: "/images/blog/blog-01.jpg",
    author: {
      name: "Katherine Harreleson",
      image: "/images/history/Katherine_Harrelson.png",
      designation: "Program Director",
    },
    tags: ["leadership"],
    publishDate: "March 15, 2025",
    content: `
      <p class="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        Since 1991, the Leadership C.O.N.N.E.C.T.I.O.N.S. Program has been empowering youth to discover their leadership potential and make meaningful contributions to their communities. Our comprehensive approach combines mentorship, skill development, and hands-on experiences to create well-rounded leaders ready to face tomorrow's challenges.
      </p>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        When you join our program, you'll immediately be connected with a network of peers, mentors, and community leaders who are invested in your success. Through our structured curriculum, you'll develop essential leadership skills while building confidence in your abilities.
      </p>
      
      <div class="relative z-10 mb-10 overflow-hidden rounded-md bg-primary bg-opacity-10 p-8 md:p-9 lg:p-8 xl:p-9">
        <p class="text-center text-base font-medium italic text-body-color">
          "The Leadership C.O.N.N.E.C.T.I.O.N.S. Program gave me the confidence and skills I needed to pursue my dreams. The mentors and experiences shaped who I am today, and I'm forever grateful for the opportunities it provided."
        </p>
        <span class="absolute right-0 top-0 z-[-1]">
          <svg
            width="170"
            height="82"
            viewBox="0 0 170 82"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="85"
              cy="-3"
              r="85"
              fill="url(#paint0_linear_48:42)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_48:42"
                x1="85"
                y1="-3"
                x2="85"
                y2="167"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#3056D3" stop-opacity="0.09" />
                <stop
                  offset="1"
                  stop-color="#C4C4C4"
                  stop-opacity="0"
                />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </div>
      
      <h3 class="font-xl mb-10 font-bold leading-tight text-black dark:text-white sm:text-2xl sm:leading-tight lg:text-xl lg:leading-tight xl:text-2xl xl:leading-tight">
        Key Program Benefits
      </h3>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>Leadership Basics & Character Education:</strong> Develop essential leadership skills and strong character foundations that will serve you throughout your personal and professional life.
      </p>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>Philanthropic Leadership & Civic Responsibility:</strong> Learn how to make a positive impact in your community through service projects and civic engagement initiatives.
      </p>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>3-Tier Mentoring Support Services:</strong> Benefit from our comprehensive mentoring approach with peer, professional, and executive mentors guiding your development.
      </p>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        Don't wait to start your leadership journey—take the first step today by applying to the Leadership C.O.N.N.E.C.T.I.O.N.S. Program!
      </p>
    `,
  },
  {
    id: 2,
    slug: "summer-college-experience",
    title: "What to Expect from Our Summer 'College Experience'",
    paragraph:
      "Our summer program offers a taste of college life while building independence and academic focus. Learn how this immersive experience prepares youth for future success.",
    image: "/images/blog/blog-02.jpg",
    author: {
      name: "Gloria Bass",
      image: "/images/logo/LeadershipConnectionsLogo.png",
      designation: "Leadership Coach",
    },
    tags: ["education"],
    publishDate: "March 10, 2025",
    content: `
      <p class="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        One of the most exciting components of the Leadership C.O.N.N.E.C.T.I.O.N.S. Program is our Summer "College Experience." This immersive opportunity allows participants to experience campus life firsthand while developing crucial independence and academic focus that will serve them well in their future educational pursuits.
      </p>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        During this week-long residential program, participants stay in actual college dormitories, attend workshops and classes taught by university professors, and engage in campus activities that mirror the college experience. This taste of independence helps youth build confidence in their ability to navigate higher education successfully.
      </p>
      
      <h3 class="font-xl mb-10 font-bold leading-tight text-black dark:text-white sm:text-2xl sm:leading-tight lg:text-xl lg:leading-tight xl:text-2xl xl:leading-tight">
        Program Highlights
      </h3>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>Academic Workshops:</strong> Participants engage in college-level workshops across various disciplines, from STEM to humanities, helping them explore potential academic interests.
      </p>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>Campus Life:</strong> Living in dormitories, eating in dining halls, and navigating campus provides an authentic preview of college life.
      </p>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>College Preparation:</strong> Sessions on college applications, financial aid, and scholarship opportunities help demystify the college admissions process.
      </p>
      
      <div class="relative z-10 mb-10 overflow-hidden rounded-md bg-primary bg-opacity-10 p-8 md:p-9 lg:p-8 xl:p-9">
        <p class="text-center text-base font-medium italic text-body-color">
          "The summer college experience was eye-opening. I was nervous about college before, but after spending a week on campus and meeting professors, I feel so much more prepared and excited for my future education."
        </p>
        <span class="absolute right-0 top-0 z-[-1]">
          <svg
            width="170"
            height="82"
            viewBox="0 0 170 82"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="85"
              cy="-3"
              r="85"
              fill="url(#paint0_linear_48:42)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_48:42"
                x1="85"
                y1="-3"
                x2="85"
                y2="167"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#3056D3" stop-opacity="0.09" />
                <stop
                  offset="1"
                  stop-color="#C4C4C4"
                  stop-opacity="0"
                />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </div>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        The Summer "College Experience" is just one of the many ways the Leadership C.O.N.N.E.C.T.I.O.N.S. Program prepares youth for future success. By providing this immersive opportunity, we help participants build confidence, independence, and academic focus that will serve them well in their educational journeys.
      </p>
    `,
  },
  {
    id: 3,
    slug: "mentoring-makes-difference",
    title: "How Our 3-Tier Mentoring Approach Makes a Difference",
    paragraph:
      "Our unique mentoring structure provides comprehensive support through peer, professional, and executive mentors. Discover how this approach helps youth thrive.",
    image: "/images/blog/blog-03.jpg",
    author: {
      name: "Katherine Harreleson",
      image: "/images/history/Katherine_Harrelson.png",
      designation: "Program Director",
    },
    tags: ["mentoring"],
    publishDate: "March 5, 2025",
    content: `
      <p class="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        At the heart of the Leadership C.O.N.N.E.C.T.I.O.N.S. Program is our innovative 3-Tier Mentoring approach. This comprehensive support system connects participants with mentors at three different levels, creating a network of guidance that addresses various aspects of personal and professional development.
      </p>
      
      <h3 class="font-xl mb-10 font-bold leading-tight text-black dark:text-white sm:text-2xl sm:leading-tight lg:text-xl lg:leading-tight xl:text-2xl xl:leading-tight">
        The Three Tiers of Mentoring
      </h3>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>Peer Mentors:</strong> Slightly older program participants or recent graduates who can relate directly to the challenges and experiences of new members. These mentors provide day-to-day support, friendship, and guidance from a perspective that's close to the mentee's own experience.
      </p>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>Professional Mentors:</strong> Established professionals from various fields who provide career guidance, academic advice, and help with developing professional skills. These mentors share their expertise and experiences, offering insights into different career paths and the skills needed to succeed.
      </p>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        <strong>Executive Mentors:</strong> Senior leaders from business, education, government, and nonprofit sectors who provide high-level guidance on leadership development, networking, and long-term career planning. These mentors open doors to opportunities and connections that might otherwise be inaccessible.
      </p>
      
      <div class="relative z-10 mb-10 overflow-hidden rounded-md bg-primary bg-opacity-10 p-8 md:p-9 lg:p-8 xl:p-9">
        <p class="text-center text-base font-medium italic text-body-color">
          "Having mentors at different levels has been invaluable. My peer mentor helps me navigate daily challenges, my professional mentor guides my career planning, and my executive mentor has opened doors I never thought possible. This layered approach has given me a support system I can rely on for different needs."
        </p>
        <span class="absolute right-0 top-0 z-[-1]">
          <svg
            width="170"
            height="82"
            viewBox="0 0 170 82"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="85"
              cy="-3"
              r="85"
              fill="url(#paint0_linear_48:42)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_48:42"
                x1="85"
                y1="-3"
                x2="85"
                y2="167"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#3056D3" stop-opacity="0.09" />
                <stop
                  offset="1"
                  stop-color="#C4C4C4"
                  stop-opacity="0"
                />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </div>
      
      <h3 class="font-xl mb-10 font-bold leading-tight text-black dark:text-white sm:text-2xl sm:leading-tight lg:text-xl lg:leading-tight xl:text-2xl xl:leading-tight">
        The Impact of Multi-Level Mentoring
      </h3>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        Research has shown that youth with multiple mentors are more likely to succeed academically, professionally, and personally. Our 3-Tier approach ensures that participants receive guidance tailored to different aspects of their development, creating a comprehensive support system that addresses both immediate needs and long-term goals.
      </p>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        Through regular meetings, workshops, and events, our mentoring relationships develop organically while still providing structured support. This balance of formal and informal mentoring creates meaningful connections that often last well beyond the program's duration.
      </p>
      
      <p class="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
        The Leadership C.O.N.N.E.C.T.I.O.N.S. Program's 3-Tier Mentoring approach is just one of the ways we're committed to providing comprehensive support for youth as they develop into the leaders of tomorrow.
      </p>
    `,
  },
];

// Fetch blogs from Firestore and combine with static data
async function fetchFirestoreBlogs(): Promise<(Blog & { slug: string; content: string })[]> {
  // Skip Firestore fetch if db is not available (e.g., during build)
  if (!db) {
    return [];
  }

  try {
    const blogsRef = collection(db, 'blogEntries');
    const querySnapshot = await getDocs(blogsRef);
    
    const firestoreBlogs: (Blog & { slug: string; content: string })[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      firestoreBlogs.push({
        id: data.id || 0,
        slug: data.slug || doc.id,
        title: data.title || '',
        paragraph: data.paragraph || '',
        image: data.image || '/images/blog/blog-default.jpg',
        author: data.author || {
          name: 'Leadership Connections',
          image: '/images/logo/LeadershipConnectionsLogo.png',
          designation: 'Team'
        },
        tags: data.tags || [],
        publishDate: data.publishDate || new Date().toISOString().split('T')[0],
        content: data.content || ''
      });
    });
    
    return firestoreBlogs;
  } catch (error) {
    console.error('Error fetching Firestore blogs:', error);
    return [];
  }
}

// Get all blogs (Firestore + static, removing duplicates)
export async function getAllBlogs() {
  const firestoreBlogs = await fetchFirestoreBlogs();
  
  // Get slugs from Firestore blogs to avoid duplicates
  const firestoreSlugs = new Set(firestoreBlogs.map(blog => blog.slug));
  
  // Filter out static blogs that exist in Firestore
  const uniqueStaticBlogs = blogData.filter(blog => !firestoreSlugs.has(blog.slug));
  
  // Combine Firestore blogs (priority) with unique static blogs
  return [...firestoreBlogs, ...uniqueStaticBlogs];
}

// Get blog by slug (check Firestore first, then static)
export async function getBlogBySlug(slug: string) {
  // Skip Firestore fetch if db is not available (e.g., during build)
  if (!db) {
    return blogData.find((blog) => blog.slug === slug);
  }

  // First check Firestore
  try {
    const blogsRef = collection(db, 'blogEntries');
    const q = query(blogsRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: data.id || 0,
        slug: data.slug || doc.id,
        title: data.title || '',
        paragraph: data.paragraph || '',
        image: data.image || '/images/blog/blog-default.jpg',
        author: data.author || {
          name: 'Leadership Connections',
          image: '/images/logo/LeadershipConnectionsLogo.png',
          designation: 'Team'
        },
        tags: data.tags || [],
        publishDate: data.publishDate || new Date().toISOString().split('T')[0],
        content: data.content || ''
      };
    }
  } catch (error) {
    console.error('Error fetching blog by slug from Firestore:', error);
  }
  
  // Fall back to static data
  return blogData.find((blog) => blog.slug === slug);
}

// Get recent blogs (for homepage)
export async function getRecentBlogs(count: number = 3) {
  const allBlogs = await getAllBlogs();
  return allBlogs.slice(0, count);
}
