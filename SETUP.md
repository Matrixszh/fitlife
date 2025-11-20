# Quick Setup Guide

## Frontend Setup (5 minutes)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Firebase:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication → Email/Password
   - Create Firestore Database (start in test mode)
   - Copy your config to `src/config/firebase.ts`

3. **Start the app:**
   ```bash
   npm run dev
   ```

## ML Component Setup (10 minutes)

1. **Navigate to ML directory:**
   ```bash
   cd ml-component
   ```

2. **Create dataset:**
   - Create `data/workout_activities.arff` file
   - See `data/README.md` for format
   - Need 50-100 rows with balanced activity types

3. **Train the model:**
   ```bash
   mvn clean compile
   mvn exec:java -Dexec.mainClass="com.fitlife.ml.ActivityClassifier" -Dexec.args="data/workout_activities.arff"
   ```

4. **Start ML server:**
   ```bash
   mvn exec:java -Dexec.mainClass="com.fitlife.ml.MLServer" -Dexec.args="models/activity_classifier.model data/workout_activities.arff"
   ```

## Testing

1. **Frontend:** Open http://localhost:5173
2. **ML API:** Test with `curl http://localhost:8080/health`

## Notes

- ML service has fallback prediction if backend is unavailable
- Frontend works without ML service (uses rule-based prediction)
- All features are implemented and ready to use!

