import { Blog } from "@/types/blog";

const blogData: Blog[] = [
  {
    id: 1,
    slug: "health-and-fitness-for-youth",
    title: "Why Health and Fitness Matter for Youth",
    paragraph:
      "Explore the role of health and fitness in building a strong foundation for youth. Learn how engaging in physical activity not only promotes well-being but also develops essential teamwork and leadership skills.",
    image: "/images/hero/pexels-vanessa-loring-7869077.jpg",
    author: {
      name: "Katherine Harreleson",
      image: "/images/blog/author-01.png",
      designation: "Program Director",
    },
    tags: ["Health", "Fitness"],
    publishDate: "2023-01-01",
  },
  {
    id: 2,
    slug: "steem-building-futures",
    title: "Introducing STEEM: Building Futures through Technology",
    paragraph:
      "Dive into how our STEEM workshops are shaping the next generation of innovators. Discover the exciting world of robotics, coding, and creative entrepreneurship, encouraging youth to explore their passion for technology.",
    image: "/images/hero/pexels-mikhail-nilov-9242856.jpg",
    author: {
      name: "Gloria Bass",
      image: "/images/blog/author-02.png",
      designation: "Leadership Coach",
    },
    tags: ["STEEM", "Technology"],
    publishDate: "2023-01-01",
  },
  {
    id: 3,
    slug: "crafting-skills-in-trades",
    title: "Crafting Skills in the Trades: Building, Designing, and Creating",
    paragraph:
      "Join us as we highlight the importance of trades education. Uncover how hands-on experience in construction, design, and craftsmanship can prepare youth for rewarding career paths.",
    image: "/images/hero/pexels-pixabay-315934.jpg",
    author: {
      name: "Katherine Harreleson",
      image: "/images/blog/author-03.png",
      designation: "Program Director",
    },
    tags: ["Trades", "Education"],
    publishDate: "2023-01-01",
  },
  {
    id: 4,
    slug: "dance-and-well-being",
    title: "Dance Your Way to Health: The Connection Between Dance and Well-being",
    paragraph:
      "Read about how dance, as a form of fitness, inspires creativity, builds confidence, and fosters strong community ties among young people.",
    image: "/images/hero/pexels-pixabay-533630.jpg",
    author: {
      name: "Katherine Harreleson",
      image: "/images/blog/author-01.png",
      designation: "Program Director",
    },
    tags: ["Dance", "Health"],
    publishDate: "2023-01-01",
  },
];
export default blogData;
