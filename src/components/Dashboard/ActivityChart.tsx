import type { Workout, ActivityType } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
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

  // Generate data for line chart - last 7 days of workout activity
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      date: format(date, 'MMM dd'),
      fullDate: startOfDay(date),
      count: 0,
    };
  });

  // Count workouts per day
  workouts.forEach((workout) => {
    const workoutDate = startOfDay(new Date(workout.date));
    const dayData = last7Days.find((day) => day.fullDate.getTime() === workoutDate.getTime());
    if (dayData) {
      dayData.count++;
    }
  });

  const pieData = Object.entries(activityCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="chart-container">
      <h3>Workouts by Activity Type</h3>
      <div className="charts-grid">
        <div className="chart-wrapper">
          <h4>Workout Trend (Last 7 Days)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#666"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '10px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#667eea" 
                strokeWidth={3}
                dot={{ fill: '#667eea', r: 5 }}
                activeDot={{ r: 7 }}
                name="Workouts"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-wrapper">
          <h4>Activity Distribution</h4>
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

