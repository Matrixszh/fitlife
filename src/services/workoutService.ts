import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Workout, WorkoutFormData, WorkoutFilters, ActivityType } from '../types';

const workoutsCollection = 'workouts';

export const addWorkout = async (userId: string, workoutData: WorkoutFormData): Promise<string> => {
  const workout: Omit<Workout, 'id'> = {
    userId,
    activityType: workoutData.activityType,
    duration: workoutData.duration,
    distance: workoutData.distance,
    calories: workoutData.calories,
    date: new Date(workoutData.date),
    notes: workoutData.notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const docRef = await addDoc(collection(db, workoutsCollection), {
    ...workout,
    date: Timestamp.fromDate(workout.date),
    createdAt: Timestamp.fromDate(workout.createdAt),
    updatedAt: Timestamp.fromDate(workout.updatedAt),
  });

  return docRef.id;
};

export const updateWorkout = async (
  workoutId: string,
  workoutData: WorkoutFormData
): Promise<void> => {
  const workoutRef = doc(db, workoutsCollection, workoutId);
  await updateDoc(workoutRef, {
    activityType: workoutData.activityType,
    duration: workoutData.duration,
    distance: workoutData.distance,
    calories: workoutData.calories,
    date: Timestamp.fromDate(new Date(workoutData.date)),
    notes: workoutData.notes,
    updatedAt: Timestamp.now(),
  });
};

export const deleteWorkout = async (workoutId: string): Promise<void> => {
  await deleteDoc(doc(db, workoutsCollection, workoutId));
};

export const getWorkouts = async (
  userId: string,
  filters?: WorkoutFilters
): Promise<Workout[]> => {
  const constraints: QueryConstraint[] = [where('userId', '==', userId)];

  if (filters?.activityType) {
    constraints.push(where('activityType', '==', filters.activityType));
  }

  if (filters?.minDuration !== undefined) {
    constraints.push(where('duration', '>=', filters.minDuration));
  }

  if (filters?.maxDuration !== undefined) {
    constraints.push(where('duration', '<=', filters.maxDuration));
  }

  if (filters?.startDate) {
    constraints.push(where('date', '>=', Timestamp.fromDate(new Date(filters.startDate))));
  }

  if (filters?.endDate) {
    constraints.push(where('date', '<=', Timestamp.fromDate(new Date(filters.endDate))));
  }

  constraints.push(orderBy('date', 'desc'));

  const q = query(collection(db, workoutsCollection), ...constraints);
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: data.date?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Workout;
  });
};

export const getWorkoutStats = async (_userId: string, workouts: Workout[]) => {
  const stats = {
    totalWorkouts: workouts.length,
    totalCalories: workouts.reduce((sum, w) => sum + w.calories, 0),
    totalDuration: workouts.reduce((sum, w) => sum + w.duration, 0),
    totalDistance: workouts.reduce((sum, w) => sum + (w.distance || 0), 0),
    workoutsByType: {
      Running: 0,
      Cycling: 0,
      Walking: 0,
      'Gym Workout': 0,
    } as Record<ActivityType, number>,
    recentWorkouts: workouts.slice(0, 5),
  };

  workouts.forEach((workout) => {
    stats.workoutsByType[workout.activityType]++;
  });

  return stats;
};

