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
  year: string;
  /** Free-form ship state shown in the dossier's spec strip, e.g. "Shipped" or "In progress". */
  status: string;
  description: string;
  tags: string[];
  /** Index plate image. May differ from detail.cover for a tighter grid crop. */
  visual: string;
  /** At least one of liveUrl / repoUrl must be set — the plate's link chip prefers liveUrl. */
  liveUrl?: string;
  repoUrl?: string;
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
