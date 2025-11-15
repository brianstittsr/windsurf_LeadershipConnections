export type Class = {
  id: number;
  slug: string;
  year: string;
  title: string;
  paragraph: string;
  image: string;
  graduationDate: string;
  classSize?: number;
  tags: string[];
};
