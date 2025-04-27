export type UserProfile = {
  user_id: string;
  user_email: string;
  last_sign_in_at: string;
  plan_id: string;
  habits_count: number;
  is_admin?: boolean;
  telegram_id?: string;
  username?: string;
};

export type AdminUserData = {
  user_id: string;
  user_email: string;
  last_sign_in_at: string;
};

export type PlanData = {
  id: string;
  name: string;
  max_habits: number;
  has_statistics: boolean;
  has_achievements: boolean;
  price: number | null;
};
