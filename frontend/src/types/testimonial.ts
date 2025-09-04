export type Testimonial = {
  id: number;
  name: string;
  destination?: string;
  image: string | { src: string; alt?: string };
  content: string;
  designation: string;
};
