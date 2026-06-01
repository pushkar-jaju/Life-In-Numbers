-- Life in Numbers - PostgreSQL Database Schema
-- This schema defines all tables and relationships for the application

-- Enable UUID extension for ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ============================================
-- Daily Statistics Table
-- ============================================
CREATE TABLE IF NOT EXISTS daily_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  keyboard_presses INTEGER DEFAULT 0,
  tabs_opened INTEGER DEFAULT 0,
  browsing_time_minutes INTEGER DEFAULT 0,
  session_duration_minutes INTEGER DEFAULT 0,
  active_time_minutes INTEGER DEFAULT 0,
  idle_time_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

CREATE INDEX idx_daily_stats_user_id ON daily_stats(user_id);
CREATE INDEX idx_daily_stats_date ON daily_stats(date);
CREATE INDEX idx_daily_stats_user_date ON daily_stats(user_id, date);

-- ============================================
-- Weekly Statistics Table (Aggregated)
-- ============================================
CREATE TABLE IF NOT EXISTS weekly_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  total_keyboard_presses INTEGER DEFAULT 0,
  total_tabs_opened INTEGER DEFAULT 0,
  total_browsing_time_minutes INTEGER DEFAULT 0,
  total_session_duration_minutes INTEGER DEFAULT 0,
  average_daily_keyboard_presses FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, week_start_date)
);

CREATE INDEX idx_weekly_stats_user_id ON weekly_stats(user_id);
CREATE INDEX idx_weekly_stats_date ON weekly_stats(week_start_date);

-- ============================================
-- Monthly Statistics Table (Aggregated)
-- ============================================
CREATE TABLE IF NOT EXISTS monthly_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  total_keyboard_presses INTEGER DEFAULT 0,
  total_tabs_opened INTEGER DEFAULT 0,
  total_browsing_time_minutes INTEGER DEFAULT 0,
  total_session_duration_minutes INTEGER DEFAULT 0,
  days_tracked INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, year, month)
);

CREATE INDEX idx_monthly_stats_user_id ON monthly_stats(user_id);
CREATE INDEX idx_monthly_stats_year_month ON monthly_stats(user_id, year, month);

-- ============================================
-- Insights Table
-- ============================================
CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  insight_text TEXT NOT NULL,
  insight_type VARCHAR(50),
  period VARCHAR(20),
  period_date DATE,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_insights_user_id ON insights(user_id);
CREATE INDEX idx_insights_period_date ON insights(period_date);
CREATE INDEX idx_insights_created_at ON insights(created_at);
CREATE INDEX idx_insights_user_created ON insights(user_id, created_at);

-- ============================================
-- Share Cards Table
-- ============================================
CREATE TABLE IF NOT EXISTS share_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255),
  description TEXT,
  stats_json JSONB,
  insight_text TEXT,
  image_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_share_cards_user_id ON share_cards(user_id);
CREATE INDEX idx_share_cards_slug ON share_cards(card_slug);
CREATE INDEX idx_share_cards_created_at ON share_cards(created_at);

-- ============================================
-- Browser Activity Log (for extension tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50),
  activity_data JSONB,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_logged_at ON activity_logs(logged_at);
CREATE INDEX idx_activity_logs_type ON activity_logs(activity_type);

-- ============================================
-- User Settings Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tracking_enabled BOOLEAN DEFAULT TRUE,
  dark_mode BOOLEAN DEFAULT TRUE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  keyboard_tracking BOOLEAN DEFAULT TRUE,
  tab_tracking BOOLEAN DEFAULT TRUE,
  browsing_time_tracking BOOLEAN DEFAULT TRUE,
  privacy_mode BOOLEAN DEFAULT FALSE,
  data_retention_days INTEGER DEFAULT 365,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- ============================================
-- Excluded Domains (for privacy mode)
-- ============================================
CREATE TABLE IF NOT EXISTS excluded_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  domain VARCHAR(255) NOT NULL,
  reason VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, domain)
);

CREATE INDEX idx_excluded_domains_user_id ON excluded_domains(user_id);
CREATE INDEX idx_excluded_domains_domain ON excluded_domains(domain);

-- ============================================
-- Feedback Table
-- ============================================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  feedback_type VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_created_at ON feedback(created_at);

-- ============================================
-- RLS (Row Level Security) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE excluded_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY users_self_read ON users
  FOR SELECT USING (auth.uid()::text = clerk_id);

-- Users can only read their own stats
CREATE POLICY stats_self_read ON daily_stats
  FOR SELECT USING (user_id = (SELECT id FROM users WHERE clerk_id = auth.uid()::text));

CREATE POLICY insights_self_read ON insights
  FOR SELECT USING (user_id = (SELECT id FROM users WHERE clerk_id = auth.uid()::text));

-- Create trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_stats_updated_at BEFORE UPDATE ON daily_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
