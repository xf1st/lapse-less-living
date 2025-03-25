
export type Plan = {
  id: string;
  name: string;
  max_habits: number;
  has_statistics: boolean;
  has_achievements: boolean;
  price: number;
};

export type HabitType = {
  id: string;
  name: string;
  description: string | null;
  frequency: string;
  color: string;
  created_at: string;
  start_date: string;
  current_streak: number;
  longest_streak: number;
  folder_id?: string | null;
  user_id: string;
};

export type FolderType = {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
};

export type HabitEntryType = {
  id: string;
  habit_id: string;
  completed_at: string;
  notes: string | null;
  is_relapse: boolean;
  user_id: string;
};
