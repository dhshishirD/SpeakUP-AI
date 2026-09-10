-- SpeakUP AI - Cloud Personal Space & Multi-Service PostgreSQL Database Schema
-- Execute this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/aizpmilyxcmvtbxyodxy/sql/new)

-- 1. Central User Profile Table
CREATE TABLE IF NOT EXISTS public.users_profile (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT DEFAULT 'Learner',
    avatar_url TEXT DEFAULT '👨‍🎓',
    cefr_level TEXT DEFAULT 'B1',
    target_track TEXT DEFAULT 'general',
    xp_total INT DEFAULT 100,
    streak_days INT DEFAULT 1,
    last_active_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for users_profile
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON public.users_profile FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.users_profile FOR ALL 
USING (auth.uid() = user_id);


-- 2. Diagnostic & Placement Test History Table
CREATE TABLE IF NOT EXISTS public.diagnostic_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    track TEXT DEFAULT 'general',
    cefr_score TEXT NOT NULL,
    subscores_json JSONB DEFAULT '{}'::jsonb,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.diagnostic_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own diagnostics" 
ON public.diagnostic_history FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diagnostics" 
ON public.diagnostic_history FOR INSERT 
WITH CHECK (auth.uid() = user_id);


-- 3. Cross-Service Activity Logs Table
CREATE TABLE IF NOT EXISTS public.service_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service_id TEXT NOT NULL, -- aiTutor, realPartner, ieltsStudio, bcsViva, jobViva, ipaLab, quizTab, vocabBankTab
    session_duration_sec INT DEFAULT 0,
    sentences_spoken INT DEFAULT 0,
    xp_gained INT DEFAULT 0,
    activity_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.service_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity logs" 
ON public.service_activity_logs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity logs" 
ON public.service_activity_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);


-- 4. Weakness Action Items Radar Table
CREATE TABLE IF NOT EXISTS public.weakness_action_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- e.g., 'Phonetics /v/ vs /b/', 'STAR Pitch Structure', 'CEFR B2 Grammar'
    service_id TEXT NOT NULL,
    total_drills INT DEFAULT 5,
    completed_drills INT DEFAULT 0,
    status TEXT DEFAULT 'active', -- active, mastered
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.weakness_action_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own action items" 
ON public.weakness_action_items FOR ALL 
USING (auth.uid() = user_id);


-- 5. Saved Voice Practice Recordings & Transcripts Vault Table
CREATE TABLE IF NOT EXISTS public.saved_audio_recordings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service_id TEXT NOT NULL,
    title TEXT NOT NULL,
    transcript TEXT,
    ai_feedback_json JSONB DEFAULT '{}'::jsonb,
    audio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.saved_audio_recordings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own audio recordings" 
ON public.saved_audio_recordings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own audio recordings" 
ON public.saved_audio_recordings FOR INSERT 
WITH CHECK (auth.uid() = user_id);


-- 6. User Vocabulary Bank & IPA Progress Table (Existing & Expanded)
CREATE TABLE IF NOT EXISTS public.user_vocab_progress (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    favorites JSONB DEFAULT '[]'::jsonb,
    weak_words JSONB DEFAULT '[]'::jsonb,
    mastered_words JSONB DEFAULT '[]'::jsonb,
    mastered_ipa_sounds JSONB DEFAULT '[]'::jsonb,
    xp_total INT DEFAULT 120,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_vocab_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own vocab progress" 
ON public.user_vocab_progress FOR ALL 
USING (auth.uid() = user_id);
