import { useState } from 'react';
import type { FormEvent } from 'react';
import type { WorkoutFormData, ActivityType, Workout } from '../../types';
import './Workout.css';

interface WorkoutFormProps {
  workout?: Workout;
  onSubmit: (data: WorkoutFormData) => Promise<void>;
  onCancel: () => void;
}

export default function WorkoutForm({ workout, onSubmit, onCancel }: WorkoutFormProps) {
  const [formData, setFormData] = useState<WorkoutFormData>({
    activityType: workout?.activityType || 'Running',
    duration: workout?.duration || 30,
    distance: workout?.distance,
    calories: workout?.calories || 200,
    date: workout?.date ? workout.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    notes: workout?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }

    if (formData.distance !== undefined && formData.distance < 0) {
      newErrors.distance = 'Distance cannot be negative';
    }

    if (formData.calories <= 0) {
      newErrors.calories = 'Calories must be greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="workout-form-container">
      <div className="workout-form-card">
        <h2>{workout ? 'Edit Workout' : 'Add New Workout'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="activityType">Activity Type *</label>
            <select
              id="activityType"
              value={formData.activityType}
              onChange={(e) => setFormData({ ...formData, activityType: e.target.value as ActivityType })}
              required
            >
              <option value="Running">Running</option>
              <option value="Cycling">Cycling</option>
              <option value="Walking">Walking</option>
              <option value="Gym Workout">Gym Workout</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration (minutes) *</label>
            <input
              type="number"
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
              required
              min="1"
            />
            {errors.duration && <span className="error-text">{errors.duration}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="distance">Distance (km) - Optional</label>
            <input
              type="number"
              id="distance"
              value={formData.distance || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  distance: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              min="0"
              step="0.1"
            />
            {errors.distance && <span className="error-text">{errors.distance}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="calories">Calories Burned *</label>
            <input
              type="number"
              id="calories"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
              required
              min="1"
            />
            {errors.calories && <span className="error-text">{errors.calories}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <span className="error-text">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes - Optional</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Add any additional notes about your workout..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : workout ? 'Update Workout' : 'Add Workout'}
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

