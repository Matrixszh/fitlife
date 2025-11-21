import { useState } from 'react';
import type { ActivityType } from '../types';
import { predictActivityType } from '../services/mlService';
import './Prediction.css';

export default function Prediction() {
  const [duration, setDuration] = useState<number>(30);
  const [distance, setDistance] = useState<number>(0);
  const [calories, setCalories] = useState<number>(200);
  const [prediction, setPrediction] = useState<{
    predictedActivity: string;
    confidence?: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    if (duration <= 0 || calories <= 0) {
      setError('Duration and calories must be greater than 0');
      return;
    }

    if (distance < 0) {
      setError('Distance cannot be negative');
      return;
    }

    setError('');
    setLoading(true);
    setPrediction(null);

    try {
      const result = await predictActivityType({
        duration,
        distance: distance > 0 ? distance : undefined,
        calories,
      });
      setPrediction(result);
    } catch (err: any) {
      setError('Failed to get prediction: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setDuration(30);
    setDistance(0);
    setCalories(200);
    setPrediction(null);
    setError('');
  };

  return (
    <div className="prediction-page">
      <div className="prediction-container">
        <div className="prediction-header">
          <h1>🤖 Activity Type Predictor</h1>
          <p>Enter workout details to predict the activity type using Machine Learning</p>
        </div>

        <div className="prediction-form-card">
          <h2>Workout Details</h2>
          
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="duration">Duration (minutes) *</label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="distance">Distance (km) - Optional</label>
            <input
              type="number"
              id="distance"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              min="0"
              step="0.1"
            />
            <small>Leave as 0 for gym workouts</small>
          </div>

          <div className="form-group">
            <label htmlFor="calories">Calories Burned *</label>
            <input
              type="number"
              id="calories"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              min="1"
              required
            />
          </div>

          <div className="form-actions">
            <button
              onClick={handlePredict}
              disabled={loading}
              className="btn-primary btn-predict"
            >
              {loading ? 'Predicting...' : '🤖 Predict Activity Type'}
            </button>
            <button onClick={handleClear} className="btn-secondary">
              Clear
            </button>
          </div>
        </div>

        {prediction && (
          <div className="prediction-result-card">
            <h2>Prediction Result</h2>
            <div className="prediction-result">
              <div className="predicted-activity">
                <span className="activity-label">Predicted Activity:</span>
                <span className="activity-value">{prediction.predictedActivity}</span>
              </div>
              {prediction.confidence !== undefined && (
                <div className="confidence">
                  <span className="confidence-label">Confidence:</span>
                  <span className="confidence-value">
                    {(prediction.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
            <div className="prediction-info">
              <p>
                💡 <strong>Note:</strong> This prediction is based on a machine learning model
                trained on workout data. The model analyzes patterns in duration, distance, and
                calories to predict the most likely activity type.
              </p>
            </div>
          </div>
        )}

        <div className="prediction-info-section">
          <h3>How It Works</h3>
          <ul>
            <li>
              <strong>Machine Learning Model:</strong> Uses WEKA J48 Decision Tree classifier
            </li>
            <li>
              <strong>Training Data:</strong> Trained on 100+ workout examples
            </li>
            <li>
              <strong>Accuracy:</strong> 87% overall accuracy
            </li>
            <li>
              <strong>Best Performance:</strong> Gym Workout (100% accuracy)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

