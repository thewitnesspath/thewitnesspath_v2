export type GuidanceQuestion = {
  id: string;
  category: string;
  question: string;
  createdAt?: string | null;
};

export type GuidancePerspective = {
  id: string;
  category: string;
  question: string;
  answer: string;
  author: string;
  views: number;
  createdAt?: string | null;
  editCode?: string | null;
};

export type GuidanceGroup = {
  category: string;
  question: string;
  perspectives: GuidancePerspective[];
};