export interface ProjectDetail {
  cover: string;
  paragraphs: string[];
}

export interface Project {
  id: string;
  number: string;
  title: string;
  category: "websites" | "fun";
  role: string;
  description: string;
  tags: string[];
  visual: string;
  link: string;
  detail: ProjectDetail;
}

export interface Poster {
  id: string;
  number: string;
  image: string;
  keywords: string[];
  tagline: string;
}

export interface Thought {
  id: string;
  number: string;
  title: string;
  body: string;
  tag: string;
  /**
   * Photo tiles only. Typographic tiles omit it and carry the bento's
   * colour-block variation instead, so the grid never reads as six
   * identical picture cards.
   */
  image?: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}
