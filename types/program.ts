import { Author } from "./blog";

export type Program = {
  id: number;
  title: string;
  paragraph: string;
  image: string;
  author: Author;
  tags: string[];
  publishDate: string;
  slug: string;
  content: string;
};
