export type Author = {
  name: string;
  image: string;
  bio?: string;
  _id?: number | string;
  _ref?: number | string;
};

export type Blog = {
  _id: number;
  title: string;
  slug?: string | { current: string };
  metadata?: string;
  body?: string;
  mainImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  author?: Author;
  tags?: string[];
  publishedAt?: string;
};
