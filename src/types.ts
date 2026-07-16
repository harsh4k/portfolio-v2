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
  image: string;
  thought: string;
  tag: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}
