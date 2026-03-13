export type Gender = "male" | "female";
export type Mezhep = "hanefi" | "shafii" | "maliki" | "hanbeli";
export type RequestStatus = "pending" | "accepted" | "rejected";
export type UserMode = "aday" | "refakatci";
export type MaritalStatus = "bekar" | "evli";
export type ChatRoomStatus = "active" | "waiting_refakatci" | "closed";
export type ModerationLevel = "düşük" | "orta" | "yüksek";

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
  marital_status: MaritalStatus;
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
  type: "video" | "article" | "letter";
  title: string;
  url?: string;
  body?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint?: string;
  source?: string;
}

export interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  is_system?: boolean;
  created_at: string;
}

export interface ChatRoom {
  id: string;
  aday1_id: string;
  aday2_id: string;
  refakatci_id: string | null;
  status: ChatRoomStatus;
  created_at: string;
  messages: Message[];
  aday1?: Profile;
  aday2?: Profile;
  refakatci?: Profile;
}

export interface KarneCategory {
  id: string;
  title: string;
  description: string;
  questions: KarneQuestion[];
}

export interface KarneQuestion {
  id: string;
  question: string;
  type: "text" | "rating" | "select";
  options?: string[];
}

export interface KarneResponse {
  question_id: string;
  answer: string;
}

export interface KarneAnalysis {
  boyutlar: {
    durustukluk: { puan: number; gerekce: string };
    sorumluluk: { puan: number; gerekce: string };
    empati: { puan: number; gerekce: string };
    dini_hassasiyet: { puan: number; gerekce: string };
    sosyal_uyum: { puan: number; gerekce: string };
  };
  ozet_portre: string;
  guclu_yonler: string[];
  dikkat_alanlari: string[];
}

export interface GuardianRelation {
  id: string;
  refakatci_id: string;
  aday_id: string;
  relation: string;
  karne_responses: KarneResponse[];
  karne_analysis: KarneAnalysis | null;
  created_at: string;
}

export interface ModerationResult {
  uygun: boolean;
  ihlal_seviyesi: ModerationLevel;
  ihlal_kategorisi: "argo" | "flört" | "teklif" | "diğer";
  refakatci_uyarisi: string;
}
