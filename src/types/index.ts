export interface User {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Date;
}

export interface Workout {
  id: string;
  userId: string;
  activityType: ActivityType;
  duration: number; // in minutes
  distance?: number; // in km
  calories: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ActivityType = 'Running' | 'Cycling' | 'Walking' | 'Gym Workout';

export interface WorkoutFormData {
  activityType: ActivityType;
  duration: number;
  distance?: number;
  calories: number;
  date: string;
  notes?: string;
}

export interface WorkoutFilters {
  activityType?: ActivityType;
  minDuration?: number;
  maxDuration?: number;
  startDate?: string;
  endDate?: string;
}

export interface DashboardStats {
  totalWorkouts: number;
  totalCalories: number;
  totalDuration: number;
  totalDistance: number;
  workoutsByType: Record<ActivityType, number>;
  recentWorkouts: Workout[];
}

