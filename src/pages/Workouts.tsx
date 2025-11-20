import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import { addWorkout, updateWorkout } from '../services/workoutService';
import type { Workout, WorkoutFormData } from '../types';
import WorkoutForm from '../components/Workout/WorkoutForm';
import WorkoutList from '../components/Workout/WorkoutList';
import './Workouts.css';

export default function Workouts() {
  const [user] = useAuthState(auth);
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddWorkout = () => {
    setEditingWorkout(undefined);
    setShowForm(true);
  };

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout);
    setShowForm(true);
  };

  const handleSubmit = async (data: WorkoutFormData) => {
    if (!user) return;

    try {
      if (editingWorkout) {
        await updateWorkout(editingWorkout.id, data);
      } else {
        await addWorkout(user.uid, data);
      }
      setShowForm(false);
      setEditingWorkout(undefined);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to save workout:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingWorkout(undefined);
  };

  if (!user) {
    return <div>Please log in to view your workouts.</div>;
  }

  return (
    <div className="workouts-page">
      <div className="workouts-header">
        <h1>My Workouts</h1>
        {!showForm && (
          <button onClick={handleAddWorkout} className="btn-primary">
            + Add New Workout
          </button>
        )}
      </div>

      {showForm ? (
        <WorkoutForm
          workout={editingWorkout}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <WorkoutList
          key={refreshKey}
          userId={user.uid}
          onEdit={handleEditWorkout}
          onRefresh={() => setRefreshKey((prev) => prev + 1)}
        />
      )}
    </div>
  );
}

