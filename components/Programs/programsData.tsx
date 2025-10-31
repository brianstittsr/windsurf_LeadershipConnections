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
    content: "",
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
