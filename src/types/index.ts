export type Role = "student" | "admin";

export type CourseStatus = "draft" | "published";
export type AccessMode = "open" | "restricted";

export type QuestionType = "single" | "multiple" | "text" | "ordering";

export interface QuestionSingle   { type?: "single";   q: string; a: string[]; correct: number; }
export interface QuestionMultiple { type:  "multiple"; q: string; a: string[]; correct: number[]; }
export interface QuestionText     { type:  "text";     q: string; accept: string[]; caseSensitive?: boolean; }
export interface QuestionOrdering { type:  "ordering"; q: string; items: string[]; }
export type Question = QuestionSingle | QuestionMultiple | QuestionText | QuestionOrdering;

export interface Block {
  type: "heading" | "text" | "video" | "image" | "callout" | "list" | "quote" | "code" | "file" | "divider" | "embed";
  [k: string]: any;
}

export interface Module {
  id: string;
  course_id: string;
  n: number;
  title: string;
  duration: string;
  description?: string;
  blocks: Block[];
  quiz: Question[];
}

export interface Course {
  id: string;
  title: string;
  short_title?: string;
  description?: string;
  level?: string;
  icon?: string;
  status: CourseStatus;
  access_mode: AccessMode;
  position: number;
  final_def: {
    theory: Question[];
    logic: Question[];
    practical: { q: string }[];
  };
  modules?: Module[];
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: Role;
  group_ids: string[];
  access_grants: string[];
  created_at: string;
}

export interface Enrollment {
  user_id: string;
  course_id: string;
  enrolled_at: string;
  progress: Record<string, boolean>;
  quiz_scores: Record<string, number>;
  quiz_locked: Record<string, boolean>;
  practice?: { text: string; at: number; score: number | null; feedback: string };
  final_result?: any;
}
