-- Vesile - Initial Database Schema
-- Milestone 1: Backend & Veritabanı Entegrasyonu

-- ============================================
-- 1. PROFILES
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18),
  city TEXT NOT NULL,
  profession TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  mezhep TEXT NOT NULL CHECK (mezhep IN ('hanefi', 'shafii', 'maliki', 'hanbeli')),
  namaz_regularity TEXT NOT NULL DEFAULT '5 vakit düzenli',
  education_level INTEGER NOT NULL DEFAULT 0,
  marital_status TEXT NOT NULL DEFAULT 'bekar' CHECK (marital_status IN ('bekar', 'evli')),
  hardware_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 2. MATCH REQUESTS
-- ============================================
CREATE TABLE match_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(sender_id, receiver_id)
);

CREATE INDEX idx_match_requests_sender ON match_requests(sender_id);
CREATE INDEX idx_match_requests_receiver ON match_requests(receiver_id);

-- ============================================
-- 3. CHAT ROOMS
-- ============================================
CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aday1_id UUID NOT NULL REFERENCES profiles(id),
  aday2_id UUID NOT NULL REFERENCES profiles(id),
  refakatci_id UUID REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'waiting_refakatci' CHECK (status IN ('active', 'waiting_refakatci', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 4. MESSAGES
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_room ON messages(room_id, created_at);

-- ============================================
-- 5. GUARDIAN RELATIONS
-- ============================================
CREATE TABLE guardian_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  refakatci_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  aday_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  relation TEXT NOT NULL,
  karne_responses JSONB NOT NULL DEFAULT '[]',
  karne_analysis JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(refakatci_id, aday_id)
);

CREATE INDEX idx_guardian_refakatci ON guardian_relations(refakatci_id);
CREATE INDEX idx_guardian_aday ON guardian_relations(aday_id);

-- ============================================
-- 6. EDUCATION PROGRESS
-- ============================================
CREATE TABLE education_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  quiz_score INTEGER,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, level)
);

CREATE INDEX idx_education_user ON education_progress(user_id);

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes profilleri gorebilir"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Kullanici kendi profilini olusturabilir"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Kullanici kendi profilini guncelleyebilir"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Match Requests
ALTER TABLE match_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Taraflar istekleri gorebilir"
  ON match_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Kullanici istek gonderebilir"
  ON match_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Alici durumu guncelleyebilir"
  ON match_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id);

-- Chat Rooms
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Katilimcilar odalari gorebilir"
  ON chat_rooms FOR SELECT
  TO authenticated
  USING (
    auth.uid() = aday1_id OR
    auth.uid() = aday2_id OR
    auth.uid() = refakatci_id
  );

CREATE POLICY "Katilimcilar oda durumunu guncelleyebilir"
  ON chat_rooms FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = aday1_id OR
    auth.uid() = aday2_id OR
    auth.uid() = refakatci_id
  );

-- Messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Oda katilimcilari mesajlari gorebilir"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE chat_rooms.id = messages.room_id
      AND (
        auth.uid() = chat_rooms.aday1_id OR
        auth.uid() = chat_rooms.aday2_id OR
        auth.uid() = chat_rooms.refakatci_id
      )
    )
  );

CREATE POLICY "Oda katilimcilari mesaj yazabilir"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE chat_rooms.id = messages.room_id
      AND (
        auth.uid() = chat_rooms.aday1_id OR
        auth.uid() = chat_rooms.aday2_id
      )
      AND chat_rooms.status = 'active'
    )
  );

-- Guardian Relations
ALTER TABLE guardian_relations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Taraflar iliskileri gorebilir"
  ON guardian_relations FOR SELECT
  TO authenticated
  USING (auth.uid() = refakatci_id OR auth.uid() = aday_id);

CREATE POLICY "Refakatci karneyi guncelleyebilir"
  ON guardian_relations FOR UPDATE
  TO authenticated
  USING (auth.uid() = refakatci_id);

-- Education Progress
ALTER TABLE education_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanici kendi ilerlemesini gorebilir"
  ON education_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanici kendi ilerlemesini kaydedebilir"
  ON education_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanici kendi ilerlemesini guncelleyebilir"
  ON education_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
