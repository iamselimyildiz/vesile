export type Gender = "male" | "female";
export type Mezhep = "hanefi" | "shafii" | "maliki" | "hanbeli";
export type RequestStatus = "pending" | "accepted" | "rejected";

export interface Profile {
  id: string;
  full_name: string;
  age: number;
  city: string;
  profession: string;
  bio: string;
  avatar_url: string | null;
  gender: Gender;
  mezhep: Mezhep;
  namaz_regularity: string;
  education_level: number;
  created_at: string;
}

export interface MatchRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: RequestStatus;
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
}

export interface EducationLevel {
  id: number;
  title: string;
  description: string;
  contents: LessonContent[];
  quiz: QuizQuestion[];
}

export interface LessonContent {
  id: string;
  type: "video" | "article";
  title: string;
  url?: string;
  body?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Message {
  id: string;
  group_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}
