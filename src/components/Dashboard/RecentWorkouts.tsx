import type { Workout } from '../../types';
import { format } from 'date-fns';
import './Dashboard.css';

interface RecentWorkoutsProps {
  workouts: Workout[];
}

export default function RecentWorkouts({ workouts }: RecentWorkoutsProps) {
  if (workouts.length === 0) {
    return (
      <div className="recent-workouts">
        <h3>Recent Workouts</h3>
        <p className="empty-text">No recent workouts</p>
      </div>
    );
  }

  return (
    <div className="recent-workouts">
      <h3>Recent Workouts</h3>
      <div className="recent-workouts-list">
        {workouts.map((workout) => (
          <div key={workout.id} className="recent-workout-item">
            <div className="recent-workout-header">
              <span className="workout-type">{workout.activityType}</span>
              <span className="workout-date">
                {format(workout.date, 'MMM dd, yyyy')}
              </span>
            </div>
            <div className="recent-workout-stats">
              <span>{workout.duration} mins</span>
              {workout.distance && <span>{workout.distance} km</span>}
              <span>{workout.calories} kcal</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

