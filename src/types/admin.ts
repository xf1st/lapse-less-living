
export type UserProfile = {
  id: string;
  email: string;
  last_sign_in_at: string;
  plan_id: string;
  habits_count: number;
  is_admin?: boolean; // Add this new field
};

export type AdminUserData = {
  id: string;
  email: string;
  last_sign_in_at: string;
};
