import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase';
import type { Workout } from '../../types';
import { getWorkouts, getWorkoutStats } from '../../services/workoutService';
import StatsCards from './StatsCards';
import ActivityChart from './ActivityChart';
import RecentWorkouts from './RecentWorkouts';
import './Dashboard.css';

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadWorkouts();
    }
  }, [user]);

  const loadWorkouts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getWorkouts(user.uid);
      setWorkouts(data);
      const workoutStats = await getWorkoutStats(user.uid, data);
      setStats(workoutStats);
    } catch (error) {
      console.error('Failed to load workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user.displayName || user.email}!</h1>
        <p>Here's your fitness overview</p>
      </div>

      {stats && (
        <>
          <StatsCards stats={stats} />
          <div className="dashboard-charts">
            <ActivityChart workouts={workouts} />
            <RecentWorkouts workouts={stats.recentWorkouts} />
          </div>
        </>
      )}

      {workouts.length === 0 && (
        <div className="empty-dashboard">
          <h2>Get Started!</h2>
          <p>Start tracking your workouts to see your progress here.</p>
        </div>
      )}
    </div>
  );
}

