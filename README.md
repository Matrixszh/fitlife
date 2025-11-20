# FitLife - Fitness Tracking Application

FitLife is a comprehensive fitness tracking application that helps users monitor their daily activities, log workouts, set goals, and track calorie intake. The system includes a machine learning component that classifies activities based on workout attributes.

## Features

### Part A: Core Functionalities

- ✅ **User Account Management**: Register, login, and profile management
- ✅ **Workout Logging**: Add, edit, and delete workouts with details (type, duration, calories, date)
- ✅ **Activity Dashboard**: Display summary statistics, charts, and history of workouts
- ✅ **Search & Filter**: Filter workouts by type, duration, or date
- ✅ **Data Validation**: Ensures valid inputs (non-negative values, valid dates)

### Part B: Machine Learning Component

- ✅ **ML Classification Model**: Uses WEKA API to predict activity type based on workout attributes
- ✅ **REST API**: Java backend service for ML predictions
- ✅ **Integration**: Frontend can call ML service for activity prediction

## Tech Stack

### Frontend
- **Vite** + **TypeScript** + **React**
- **Firebase** (Authentication & Firestore)
- **React Router** for navigation
- **Recharts** for data visualization
- **React Firebase Hooks** for authentication state

### Backend (ML Component)
- **Java 11+**
- **WEKA 3.8.6** for machine learning
- **Spark Java** for REST API
- **Maven** for dependency management

## Project Structure

```
fitlife/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   │   ├── Auth/               # Authentication components
│   │   ├── Dashboard/          # Dashboard components
│   │   ├── Layout/             # Layout components (Navbar)
│   │   ├── Profile/            # Profile management
│   │   └── Workout/            # Workout components
│   ├── config/                 # Configuration files
│   ├── pages/                  # Page components
│   ├── services/               # Service layer (Firebase, ML)
│   └── types/                  # TypeScript type definitions
├── ml-component/               # Java ML component
│   ├── src/main/java/         # Java source code
│   ├── data/                  # Dataset directory
│   └── models/                # Trained model directory
└── public/                     # Static assets
```

## Setup Instructions

### 1. Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase config to `src/config/firebase.ts`

3. Start the development server:
```bash
npm run dev
```

### 2. ML Component Setup

1. Navigate to ML component directory:
```bash
cd ml-component
```

2. Prepare the dataset:
   - Create `data/workout_activities.arff` file (see `ml-component/data/README.md` for format)
   - Ensure you have at least 50-100 rows with balanced activity types

3. Build the project:
```bash
mvn clean compile
```

4. Train the model:
```bash
mvn exec:java -Dexec.mainClass="com.fitlife.ml.ActivityClassifier" -Dexec.args="data/workout_activities.arff"
```

5. Start the ML server:
```bash
mvn exec:java -Dexec.mainClass="com.fitlife.ml.MLServer" -Dexec.args="models/activity_classifier.model data/workout_activities.arff"
```

The ML server will run on `http://localhost:8080`

### 3. Environment Variables (Optional)

Create a `.env` file in the root directory:
```
VITE_ML_API_URL=http://localhost:8080/api/predict
```

## Usage

### Frontend Application

1. **Register/Login**: Create an account or login with existing credentials
2. **Dashboard**: View your fitness statistics and charts
3. **Add Workout**: Log your workouts with details
4. **ML Prediction**: Use the "🤖 Predict Activity" button in the workout form to get ML-based activity type prediction
5. **Filter Workouts**: Use filters to search and filter your workout history

### ML Component

The ML component provides:
- **Training**: Train a classification model using WEKA
- **Evaluation**: Evaluate model performance with cross-validation
- **Prediction**: Predict activity type from workout attributes
- **REST API**: HTTP endpoint for predictions

## Dataset Format

The dataset should be in ARFF format with:
- `duration` (numeric): Duration in minutes
- `distance` (numeric): Distance in kilometers (0 for gym workouts)
- `calories` (numeric): Calories burned
- `activityType` (nominal): One of {Running, Cycling, Walking, Gym_Workout}

## API Endpoints

### ML Service

- `GET /health` - Health check
- `POST /api/predict` - Predict activity type
  ```json
  {
    "duration": 30,
    "distance": 5.2,
    "calories": 320
  }
  ```

## Development

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### ML Component
```bash
mvn clean compile    # Compile Java code
mvn test            # Run tests (if any)
mvn package         # Create JAR file
```

## Notes

- The ML service uses a fallback rule-based prediction if the Java backend is unavailable
- Ensure Firebase security rules are properly configured for production
- The ML model needs to be trained before the prediction service works
- Distance should be 0 for Gym Workout activities

## License

This project is created for educational purposes.
