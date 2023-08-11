export type Source = {
  id: string | null;
  name: string;
};

export type Article = {
  id: number;
  source: Source;
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string | null;
  pinned: boolean;
};

export type NewsApiResponse = {
  status: string;
  totalResults: number;
  articles: Article[];
};
