import { useState, useEffect } from 'react';
import type { Workout, WorkoutFilters, ActivityType } from '../../types';
import { getWorkouts, deleteWorkout } from '../../services/workoutService';
import { format } from 'date-fns';
import './Workout.css';

interface WorkoutListProps {
  userId: string;
  onEdit: (workout: Workout) => void;
  onRefresh: () => void;
}

export default function WorkoutList({ userId, onEdit, onRefresh }: WorkoutListProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<WorkoutFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadWorkouts();
  }, [userId, filters]);

  const loadWorkouts = async () => {
    setLoading(true);
    try {
      const data = await getWorkouts(userId, filters);
      setWorkouts(data);
    } catch (error) {
      console.error('Failed to load workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (workoutId: string) => {
    if (!confirm('Are you sure you want to delete this workout?')) return;

    try {
      await deleteWorkout(workoutId);
      loadWorkouts();
      onRefresh();
    } catch (error) {
      console.error('Failed to delete workout:', error);
      alert('Failed to delete workout. Please try again.');
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  if (loading) {
    return <div className="loading">Loading workouts...</div>;
  }

  return (
    <div className="workout-list-container">
      <div className="workout-list-header">
        <h2>Your Workouts</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Activity Type</label>
            <select
              value={filters.activityType || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  activityType: e.target.value ? (e.target.value as ActivityType) : undefined,
                })
              }
            >
              <option value="">All Types</option>
              <option value="Running">Running</option>
              <option value="Cycling">Cycling</option>
              <option value="Walking">Walking</option>
              <option value="Gym Workout">Gym Workout</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Min Duration (mins)</label>
            <input
              type="number"
              value={filters.minDuration || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  minDuration: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              min="0"
            />
          </div>

          <div className="filter-group">
            <label>Max Duration (mins)</label>
            <input
              type="number"
              value={filters.maxDuration || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  maxDuration: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              min="0"
            />
          </div>

          <div className="filter-group">
            <label>Start Date</label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value || undefined })
              }
            />
          </div>

          <div className="filter-group">
            <label>End Date</label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value || undefined })
              }
            />
          </div>

          <button onClick={clearFilters} className="btn-secondary">
            Clear Filters
          </button>
        </div>
      )}

      {workouts.length === 0 ? (
        <div className="empty-state">
          <p>No workouts found. Start by adding your first workout!</p>
        </div>
      ) : (
        <div className="workout-grid">
          {workouts.map((workout) => (
            <div key={workout.id} className="workout-card">
              <div className="workout-card-header">
                <h3>{workout.activityType}</h3>
                <div className="workout-actions">
                  <button onClick={() => onEdit(workout)} className="btn-icon">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(workout.id)} className="btn-icon">
                    🗑️
                  </button>
                </div>
              </div>
              <div className="workout-card-body">
                <div className="workout-stat">
                  <span className="stat-label">Duration:</span>
                  <span className="stat-value">{workout.duration} mins</span>
                </div>
                {workout.distance !== undefined && (
                  <div className="workout-stat">
                    <span className="stat-label">Distance:</span>
                    <span className="stat-value">{workout.distance} km</span>
                  </div>
                )}
                <div className="workout-stat">
                  <span className="stat-label">Calories:</span>
                  <span className="stat-value">{workout.calories} kcal</span>
                </div>
                <div className="workout-stat">
                  <span className="stat-label">Date:</span>
                  <span className="stat-value">
                    {format(workout.date, 'MMM dd, yyyy')}
                  </span>
                </div>
                {workout.notes && (
                  <div className="workout-notes">
                    <strong>Notes:</strong> {workout.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

