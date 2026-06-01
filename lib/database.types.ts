// Database Types for Life in Numbers
// Generated from schema - keep in sync with database/001_initial_schema.sql

export type User = {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type DailyStats = {
  id: string;
  user_id: string;
  date: string; // DATE format YYYY-MM-DD
  keyboard_presses: number;
  tabs_opened: number;
  browsing_time_minutes: number;
  session_duration_minutes: number;
  active_time_minutes: number;
  idle_time_minutes: number;
  created_at: string;
  updated_at: string;
};

export type WeeklyStats = {
  id: string;
  user_id: string;
  week_start_date: string;
  week_end_date: string;
  total_keyboard_presses: number;
  total_tabs_opened: number;
  total_browsing_time_minutes: number;
  total_session_duration_minutes: number;
  average_daily_keyboard_presses: number;
  created_at: string;
  updated_at: string;
};

export type MonthlyStats = {
  id: string;
  user_id: string;
  year: number;
  month: number;
  total_keyboard_presses: number;
  total_tabs_opened: number;
  total_browsing_time_minutes: number;
  total_session_duration_minutes: number;
  days_tracked: number;
  created_at: string;
  updated_at: string;
};

export type Insight = {
  id: string;
  user_id: string;
  insight_text: string;
  insight_type: 'keyboard' | 'browsing' | 'tabs' | 'session' | 'general' | null;
  period: 'daily' | 'weekly' | 'monthly' | null;
  period_date: string | null;
  generated_at: string;
  is_shared: boolean;
  created_at: string;
};

export type ShareCard = {
  id: string;
  user_id: string;
  card_slug: string;
  title: string | null;
  description: string | null;
  stats_json: Record<string, any> | null;
  insight_text: string | null;
  image_url: string | null;
  is_public: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
};

export type ActivityLog = {
  id: string;
  user_id: string;
  activity_type: 'keyboard' | 'tab_open' | 'tab_close' | 'focus' | 'blur' | null;
  activity_data: Record<string, any> | null;
  logged_at: string;
  created_at: string;
};

export type UserSettings = {
  id: string;
  user_id: string;
  tracking_enabled: boolean;
  dark_mode: boolean;
  notifications_enabled: boolean;
  keyboard_tracking: boolean;
  tab_tracking: boolean;
  browsing_time_tracking: boolean;
  privacy_mode: boolean;
  data_retention_days: number;
  created_at: string;
  updated_at: string;
};

export type ExcludedDomain = {
  id: string;
  user_id: string;
  domain: string;
  reason: string | null;
  created_at: string;
};

export type Feedback = {
  id: string;
  user_id: string | null;
  feedback_type: 'bug' | 'feature_request' | 'general' | null;
  title: string;
  description: string;
  status: 'open' | 'in_review' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
};

// Extended types for API responses
export type DailyStatsWithUser = DailyStats & {
  user?: User;
};

export type InsightWithStats = Insight & {
  daily_stats?: DailyStats;
};

export type ShareCardWithUser = ShareCard & {
  user?: User;
};
