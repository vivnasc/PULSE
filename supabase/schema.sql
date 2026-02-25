-- ============================================
-- PULSE Dating Platform - Supabase Schema
-- Version: 1.0.0 (MVP)
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL CHECK (char_length(display_name) >= 2),
  birth_date DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'non_binary', 'other')),
  gender_preference TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  photos TEXT[] NOT NULL DEFAULT '{}',
  voice_note_url TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  location_city TEXT,
  location_country TEXT,
  location_point GEOGRAPHY(Point, 4326),
  prompts JSONB NOT NULL DEFAULT '[]',
  interests TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{pt,en}',
  relationship_type TEXT NOT NULL DEFAULT 'open' CHECK (relationship_type IN ('serious', 'casual', 'friendship', 'open')),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_level TEXT NOT NULL DEFAULT 'none' CHECK (verification_level IN ('none', 'selfie', 'id', 'full')),
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'flame', 'blaze')),
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  settings JSONB NOT NULL DEFAULT '{
    "show_distance": true,
    "show_age": true,
    "incognito_mode": false,
    "notifications_enabled": true,
    "notification_matches": true,
    "notification_messages": true,
    "notification_likes": true,
    "language": "pt",
    "theme": "dark",
    "data_saver": false
  }',
  age_range_min INT NOT NULL DEFAULT 18 CHECK (age_range_min >= 18),
  age_range_max INT NOT NULL DEFAULT 50 CHECK (age_range_max <= 100),
  max_distance_km INT NOT NULL DEFAULT 50,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_banned BOOLEAN NOT NULL DEFAULT FALSE,
  ban_reason TEXT
);

-- Auto-update location point from lat/lng
CREATE OR REPLACE FUNCTION update_location_point()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.location_lat IS NOT NULL AND NEW.location_lng IS NOT NULL THEN
    NEW.location_point = ST_SetSRID(ST_MakePoint(NEW.location_lng, NEW.location_lat), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_location_point
  BEFORE INSERT OR UPDATE OF location_lat, location_lng ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_location_point();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SWIPES
-- ============================================
CREATE TABLE IF NOT EXISTS public.swipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  swiper_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  swiped_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('like', 'super_like', 'pass')),
  UNIQUE(swiper_id, swiped_id)
);

CREATE INDEX idx_swipes_swiper ON public.swipes(swiper_id);
CREATE INDEX idx_swipes_swiped ON public.swipes(swiped_id);
CREATE INDEX idx_swipes_action ON public.swipes(action) WHERE action IN ('like', 'super_like');

-- ============================================
-- MATCHES
-- ============================================
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_a_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'matched' CHECK (status IN ('pending', 'matched', 'unmatched')),
  user_a_action TEXT CHECK (user_a_action IN ('like', 'super_like', 'pass')),
  user_b_action TEXT CHECK (user_b_action IN ('like', 'super_like', 'pass')),
  compatibility_score FLOAT,
  ai_insights JSONB,
  UNIQUE(user_a_id, user_b_id)
);

CREATE INDEX idx_matches_user_a ON public.matches(user_a_id);
CREATE INDEX idx_matches_user_b ON public.matches(user_b_id);
CREATE INDEX idx_matches_status ON public.matches(status);

-- ============================================
-- MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'voice', 'image', 'gif', 'system')),
  media_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  ai_coaching_tip TEXT,
  emotion_data JSONB
);

CREATE INDEX idx_messages_match ON public.messages(match_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_created ON public.messages(created_at DESC);
CREATE INDEX idx_messages_unread ON public.messages(match_id, is_read) WHERE is_read = FALSE;

-- ============================================
-- SUBSCRIPTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'flame', 'blaze')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL,
  payment_provider TEXT NOT NULL CHECK (payment_provider IN ('stripe', 'mpesa', 'paypal')),
  provider_subscription_id TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD'
);

CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

-- ============================================
-- REPORTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('fake', 'harassment', 'spam', 'inappropriate', 'underage', 'other')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved'))
);

CREATE INDEX idx_reports_reported ON public.reports(reported_id);
CREATE INDEX idx_reports_status ON public.reports(status);

-- ============================================
-- WAITLIST
-- ============================================
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'landing_page'
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read others, update own
CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated' AND is_active = TRUE AND is_banned = FALSE);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Swipes: users can manage their own
CREATE POLICY "Users can view their own swipes" ON public.swipes
  FOR SELECT USING (auth.uid() = swiper_id);

CREATE POLICY "Users can create swipes" ON public.swipes
  FOR INSERT WITH CHECK (auth.uid() = swiper_id);

-- Matches: both users can view
CREATE POLICY "Users can view their matches" ON public.matches
  FOR SELECT USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE POLICY "Users can update their matches" ON public.matches
  FOR UPDATE USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- Messages: match participants only
CREATE POLICY "Match participants can view messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.matches
      WHERE matches.id = messages.match_id
      AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
    )
  );

CREATE POLICY "Match participants can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.matches
      WHERE matches.id = match_id
      AND matches.status = 'matched'
      AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
    )
  );

CREATE POLICY "Users can update message read status" ON public.messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.matches
      WHERE matches.id = messages.match_id
      AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
    )
  );

-- Subscriptions: own only
CREATE POLICY "Users can view their own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Reports: can create, can view own
CREATE POLICY "Users can create reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports" ON public.reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- Waitlist: anyone can insert
CREATE POLICY "Anyone can join waitlist" ON public.waitlist
  FOR INSERT WITH CHECK (TRUE);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to create match when mutual like
CREATE OR REPLACE FUNCTION check_mutual_like()
RETURNS TRIGGER AS $$
DECLARE
  mutual_swipe RECORD;
BEGIN
  IF NEW.action IN ('like', 'super_like') THEN
    SELECT * INTO mutual_swipe FROM public.swipes
    WHERE swiper_id = NEW.swiped_id
    AND swiped_id = NEW.swiper_id
    AND action IN ('like', 'super_like');

    IF FOUND THEN
      INSERT INTO public.matches (user_a_id, user_b_id, user_a_action, user_b_action, status)
      VALUES (
        LEAST(NEW.swiper_id, NEW.swiped_id),
        GREATEST(NEW.swiper_id, NEW.swiped_id),
        CASE WHEN NEW.swiper_id < NEW.swiped_id THEN NEW.action ELSE mutual_swipe.action END,
        CASE WHEN NEW.swiper_id < NEW.swiped_id THEN mutual_swipe.action ELSE NEW.action END,
        'matched'
      )
      ON CONFLICT (user_a_id, user_b_id) DO UPDATE
      SET status = 'matched',
          user_a_action = EXCLUDED.user_a_action,
          user_b_action = EXCLUDED.user_b_action;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_check_mutual_like
  AFTER INSERT ON public.swipes
  FOR EACH ROW
  EXECUTE FUNCTION check_mutual_like();

-- Function to get discover profiles (excluding already swiped)
CREATE OR REPLACE FUNCTION get_discover_profiles(
  user_id UUID,
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  max_dist_km INT DEFAULT 50,
  min_age INT DEFAULT 18,
  max_age INT DEFAULT 50,
  gender_pref TEXT[] DEFAULT '{}',
  result_limit INT DEFAULT 20
)
RETURNS SETOF public.profiles AS $$
BEGIN
  RETURN QUERY
  SELECT p.*
  FROM public.profiles p
  WHERE p.id != user_id
    AND p.is_active = TRUE
    AND p.is_banned = FALSE
    AND p.onboarding_completed = TRUE
    AND (array_length(gender_pref, 1) IS NULL OR p.gender = ANY(gender_pref))
    AND EXTRACT(YEAR FROM AGE(p.birth_date)) BETWEEN min_age AND max_age
    AND p.id NOT IN (
      SELECT s.swiped_id FROM public.swipes s WHERE s.swiper_id = user_id
    )
    AND (
      user_lat IS NULL
      OR user_lng IS NULL
      OR p.location_point IS NULL
      OR ST_DWithin(
        p.location_point,
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
        max_dist_km * 1000
      )
    )
  ORDER BY
    CASE WHEN p.location_point IS NOT NULL AND user_lat IS NOT NULL THEN
      ST_Distance(
        p.location_point,
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
      )
    ELSE 999999999 END
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, birth_date, gender)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'birth_date')::DATE, '2000-01-01'),
    COALESCE(NEW.raw_user_meta_data->>'gender', 'other')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- REALTIME
-- ============================================

-- Enable realtime for messages (chat)
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
