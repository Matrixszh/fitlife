import type { Workout, ActivityType } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';

interface ActivityChartProps {
  workouts: Workout[];
}

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];

export default function ActivityChart({ workouts }: ActivityChartProps) {
  const activityCounts: Record<ActivityType, number> = {
    Running: 0,
    Cycling: 0,
    Walking: 0,
    'Gym Workout': 0,
  };

  workouts.forEach((workout) => {
    activityCounts[workout.activityType]++;
  });

  const chartData = Object.entries(activityCounts).map(([name, value]) => ({
    name,
    count: value,
  }));

  const pieData = chartData.map((item) => ({
    name: item.name,
    value: item.count,
  }));

  return (
    <div className="chart-container">
      <h3>Workouts by Activity Type</h3>
      <div className="charts-grid">
        <div className="chart-wrapper">
          <h4>Bar Chart</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-wrapper">
          <h4>Pie Chart</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

