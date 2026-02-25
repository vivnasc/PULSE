export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          display_name: string;
          birth_date: string;
          gender: "male" | "female" | "non_binary" | "other";
          gender_preference: ("male" | "female" | "non_binary" | "other")[];
          bio: string | null;
          photos: string[];
          voice_note_url: string | null;
          location_lat: number | null;
          location_lng: number | null;
          location_city: string | null;
          location_country: string | null;
          prompts: PromptAnswer[];
          interests: string[];
          languages: string[];
          relationship_type: "serious" | "casual" | "friendship" | "open";
          is_verified: boolean;
          verification_level: "none" | "selfie" | "id" | "full";
          is_premium: boolean;
          subscription_tier: "free" | "flame" | "blaze";
          onboarding_completed: boolean;
          last_active: string;
          settings: ProfileSettings;
          age_range_min: number;
          age_range_max: number;
          max_distance_km: number;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          email: string;
          display_name: string;
          birth_date: string;
          gender: "male" | "female" | "non_binary" | "other";
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      matches: {
        Row: {
          id: string;
          created_at: string;
          user_a_id: string;
          user_b_id: string;
          status: "pending" | "matched" | "unmatched";
          user_a_action: "like" | "super_like" | "pass" | null;
          user_b_action: "like" | "super_like" | "pass" | null;
          compatibility_score: number | null;
          ai_insights: Json | null;
        };
        Insert: {
          user_a_id: string;
          user_b_id: string;
          user_a_action: "like" | "super_like" | "pass";
        };
        Update: Partial<Database["public"]["Tables"]["matches"]["Row"]>;
      };
      messages: {
        Row: {
          id: string;
          created_at: string;
          match_id: string;
          sender_id: string;
          content: string;
          type: "text" | "voice" | "image" | "gif" | "system";
          media_url: string | null;
          is_read: boolean;
          ai_coaching_tip: string | null;
          emotion_data: Json | null;
        };
        Insert: {
          match_id: string;
          sender_id: string;
          content: string;
          type?: "text" | "voice" | "image" | "gif" | "system";
          media_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Row"]>;
      };
      swipes: {
        Row: {
          id: string;
          created_at: string;
          swiper_id: string;
          swiped_id: string;
          action: "like" | "super_like" | "pass";
        };
        Insert: {
          swiper_id: string;
          swiped_id: string;
          action: "like" | "super_like" | "pass";
        };
        Update: Partial<Database["public"]["Tables"]["swipes"]["Row"]>;
      };
      subscriptions: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          tier: "free" | "flame" | "blaze";
          status: "active" | "cancelled" | "expired" | "trial";
          current_period_start: string;
          current_period_end: string;
          payment_provider: "stripe" | "mpesa" | "paypal";
          provider_subscription_id: string | null;
          amount: number;
          currency: string;
        };
        Insert: Omit<Database["public"]["Tables"]["subscriptions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]>;
      };
      reports: {
        Row: {
          id: string;
          created_at: string;
          reporter_id: string;
          reported_id: string;
          reason: "fake" | "harassment" | "spam" | "inappropriate" | "underage" | "other";
          description: string | null;
          status: "pending" | "reviewed" | "resolved";
        };
        Insert: Omit<Database["public"]["Tables"]["reports"]["Row"], "id" | "created_at" | "status">;
        Update: Partial<Database["public"]["Tables"]["reports"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export interface PromptAnswer {
  prompt_id: string;
  question: string;
  answer: string;
}

export interface ProfileSettings {
  show_distance: boolean;
  show_age: boolean;
  incognito_mode: boolean;
  notifications_enabled: boolean;
  notification_matches: boolean;
  notification_messages: boolean;
  notification_likes: boolean;
  language: string;
  theme: "dark" | "light" | "system";
  data_saver: boolean;
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Match = Database["public"]["Tables"]["matches"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type Swipe = Database["public"]["Tables"]["swipes"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
