import { Blog } from "@/types/blog";

const blogData: Blog[] = [
  {
    id: 1,
    slug: "best-ui-components",
    title: "Best UI components for modern websites",
    paragraph:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sit amet dictum neque, laoreet dolor.",
    image: "/images/blog/blog-01.jpg",
    author: {
      name: "Katherine Harreleson",
      image: "/images/blog/author-01.png",
      designation: "Program Director",
    },
    tags: ["creative"],
    publishDate: "2025",
  },
  {
    id: 2,
    slug: "improve-design-skills",
    title: "9 simple ways to improve your design skills",
    paragraph:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sit amet dictum neque, laoreet dolor.",
    image: "/images/blog/blog-02.jpg",
    author: {
      name: "Gloria Bass",
      image: "/images/blog/author-02.png",
      designation: "Leadership Coach",
    },
    tags: ["computer"],
    publishDate: "2025",
  },
  {
    id: 3,
    slug: "improve-coding-speed",
    title: "Tips to quickly improve your coding speed.",
    paragraph:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sit amet dictum neque, laoreet dolor.",
    image: "/images/blog/blog-03.jpg",
    author: {
      name: "Katherine Harreleson",
      image: "/images/blog/author-03.png",
      designation: "Program Director",
    },
    tags: ["design"],
    publishDate: "2025",
  },
];
export default blogData;
