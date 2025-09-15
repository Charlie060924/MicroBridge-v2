export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  technologies: string[];
  images: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  dateCompleted: string;
  files?: ProjectFile[];
}

export interface ProjectFile {
  id: string;
  name: string;
  type: 'image' | 'document' | 'code';
  url: string;
  size: number;
}

export type ProjectCategory = 
  | 'web-development'
  | 'mobile-development'
  | 'data-science'
  | 'design'
  | 'marketing'
  | 'business'
  | 'other';

export const categoryLabels: Record<ProjectCategory, string> = {
  'web-development': 'Web Development',
  'mobile-development': 'Mobile Development',
  'data-science': 'Data Science',
  'design': 'Design',
  'marketing': 'Marketing',
  'business': 'Business',
  'other': 'Other'
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};