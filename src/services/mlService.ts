// Service to interact with the Java ML backend
// This will call a REST API endpoint that runs the WEKA model

export interface MLPredictionRequest {
  duration: number;
  distance?: number;
  calories: number;
}

export interface MLPredictionResponse {
  predictedActivity: string;
  confidence?: number;
}

// ML Service endpoint - update this to match your Java server URL
const ML_API_URL = 'http://localhost:8080/api/predict';

/**
 * Predict activity type using the ML model
 * Falls back to rule-based prediction if ML service is unavailable
 */
export const predictActivityType = async (
  data: MLPredictionRequest
): Promise<MLPredictionResponse> => {
  try {
    // Try to call the Java ML backend
    const response = await fetch(ML_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        duration: data.duration,
        distance: data.distance || 0,
        calories: data.calories,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        predictedActivity: result.predictedActivity,
        confidence: result.confidence,
      };
    }
  } catch (error) {
    console.warn('ML service unavailable, using fallback prediction:', error);
  }

  // Fallback rule-based prediction when ML service is not available
  const { duration, distance } = data;

  if (distance === undefined || distance === 0) {
    return { predictedActivity: 'Gym Workout', confidence: 0.8 };
  }

  const speed = distance / (duration / 60); // km/h

  if (speed > 15) {
    return { predictedActivity: 'Cycling', confidence: 0.85 };
  } else if (speed > 8) {
    return { predictedActivity: 'Running', confidence: 0.8 };
  } else {
    return { predictedActivity: 'Walking', confidence: 0.75 };
  }
};

