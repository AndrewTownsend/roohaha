export interface Book {
  title: string;
  author: string;
}

export interface Game {
  title: string;
}

export type ProjectStatus = 'building' | 'shipped' | 'paused' | 'planned' | 'beta';

export interface ProjectLink {
  kind: 'github' | 'ios' | 'android' | 'web' | 'page';
  label: string;
  href: string;
  primary?: boolean;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  desc: string;
  status: ProjectStatus;
  statusLabel: string;
  meta: string;
  links: ProjectLink[];
}
