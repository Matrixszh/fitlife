import './Dashboard.css';

// Import the type
import type { DashboardStats } from '../../types';

interface StatsCardsProps {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="stats-cards">
      <div className="stat-card">
        <div className="stat-icon">🏃</div>
        <div className="stat-content">
          <h3>{stats.totalWorkouts}</h3>
          <p>Total Workouts</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🔥</div>
        <div className="stat-content">
          <h3>{stats.totalCalories.toLocaleString()}</h3>
          <p>Calories Burned</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">⏱️</div>
        <div className="stat-content">
          <h3>{stats.totalDuration}</h3>
          <p>Total Minutes</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">📏</div>
        <div className="stat-content">
          <h3>{stats.totalDistance.toFixed(1)}</h3>
          <p>Total Distance (km)</p>
        </div>
      </div>
    </div>
  );
}
