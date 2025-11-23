# FitLife - Fitness Tracking Application

FitLife is a comprehensive fitness tracking application that helps users monitor their daily activities, log workouts, track their progress, and get AI-powered activity predictions. The system includes a machine learning component that classifies activities based on workout attributes.

## 🎯 Features

### Core Functionalities

- ✅ **User Account Management**: Secure registration, login, and profile management with Firebase Authentication
- ✅ **Profile Management**: Update display name, weight (kg), and height (cm)
- ✅ **Workout Logging**: Add, edit, and delete workouts with details (type, duration, distance, calories, date, notes)
- ✅ **Activity Dashboard**: Display summary statistics, interactive charts, and recent workout history
- ✅ **Search & Filter**: Filter workouts by activity type, duration range, or date range
- ✅ **Data Validation**: Ensures valid inputs (non-negative values, valid dates)
- ✅ **ML-Powered Predictions**: AI-based activity type prediction using WEKA machine learning

### Machine Learning Component

- ✅ **ML Classification Model**: Uses WEKA API (J48 Decision Tree) to predict activity type based on workout attributes
- ✅ **REST API**: Java backend service for ML predictions running on port 8080
- ✅ **Fallback System**: Rule-based prediction when ML service is unavailable
- ✅ **Confidence Scores**: Provides prediction confidence levels

## 🛠️ Tech Stack

### Frontend
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Firebase** - Authentication & Firestore database
- **React Firebase Hooks** - Firebase integration hooks
- **Recharts** - Data visualization library
- **Date-fns** - Date utility library

### Backend (ML Component)
- **Java 11+** - Programming language
- **WEKA 3.8.6** - Machine learning library
- **Spark Java** - Lightweight REST API framework
- **Maven** - Dependency management and build tool
- **Gson** - JSON processing

## 📁 Project Structure

```
fitlife/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   │   ├── Auth/               # Authentication (Login, Register)
│   │   ├── Dashboard/          # Dashboard (Stats, Charts, Recent Workouts)
│   │   ├── Layout/             # Layout components (Navbar)
│   │   ├── Profile/            # Profile management (Name, Weight, Height)
│   │   ├── Workout/            # Workout components (Form, List)
│   │   └── ui/                 # UI components
│   ├── config/                 # Configuration files
│   │   └── firebase.ts        # Firebase configuration
│   ├── pages/                  # Page components
│   │   ├── Workouts.tsx       # Workouts page
│   │   └── Prediction.tsx     # ML Prediction page
│   ├── services/               # Service layer
│   │   ├── authService.ts     # Authentication & user profile
│   │   ├── workoutService.ts  # Workout CRUD operations
│   │   └── mlService.ts       # ML prediction service
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts           # All type definitions
│   ├── App.tsx                 # Main app component with routing
│   └── main.tsx               # Application entry point
├── ml-component/               # Java ML component
│   ├── src/main/java/         # Java source code
│   │   └── com/fitlife/ml/
│   │       ├── ActivityClassifier.java  # Model training
│   │       ├── MLService.java           # Prediction service
│   │       └── MLServer.java            # REST API server
│   ├── data/                  # Dataset directory
│   │   └── workout_activities.arff
│   ├── models/                # Trained model directory
│   │   └── activity_classifier.model
│   ├── pom.xml                # Maven configuration
│   └── README.md              # ML component documentation
├── public/                     # Static assets
├── package.json               # Node.js dependencies
├── vite.config.ts             # Vite configuration
└── tsconfig.json              # TypeScript configuration
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** 18+ and npm
- **Java** 11 or higher
- **Maven** 3.6+
- **Firebase Account** (free tier works)

### 1. Frontend Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable **Authentication** → **Email/Password** provider
   - Create a **Firestore Database** (start in test mode)
   - Copy your Firebase config to `src/config/firebase.ts`:
   ```typescript
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   ```

3. **Configure Firestore Security Rules:**
   - Go to Firestore → Rules tab
   - Paste the following rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       function isAuthenticated() {
         return request.auth != null;
       }
       
       function isOwner(userId) {
         return isAuthenticated() && request.auth.uid == userId;
       }
       
       match /users/{userId} {
         allow read, write: if isOwner(userId);
       }
       
       match /workouts/{workoutId} {
         allow read, write: if isAuthenticated() && 
           resource.data.userId == request.auth.uid;
       }
     }
   }
   ```

4. **Create Firestore Indexes:**
   - See [Firebase Indexes](#firebase-indexes) section below
   - Firebase will automatically prompt you when indexes are needed

5. **Start the development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in terminal)

### 2. ML Component Setup

1. **Navigate to ML component directory:**
```bash
cd ml-component
```

2. **Prepare the dataset:**
   - Create `data/workout_activities.arff` file
   - See `ml-component/data/README.md` for format requirements
   - Ensure you have at least 50-100 rows with balanced activity types
   - Format example:
   ```arff
   @relation workout_activities
   @attribute duration numeric
   @attribute distance numeric
   @attribute calories numeric
   @attribute activityType {Running,Cycling,Walking,Gym_Workout}
   @data
   30,5.2,320,Running
   45,15.0,450,Cycling
   ```

3. **Build the project:**
```bash
mvn clean compile
```

4. **Train the model:**
   
   **For PowerShell (Windows):**
   ```powershell
   mvn exec:java '-Dexec.mainClass=com.fitlife.ml.ActivityClassifier' '-Dexec.args=data/workout_activities.arff'
   ```
   
   **For Bash/Linux/Mac:**
   ```bash
   mvn exec:java -Dexec.mainClass="com.fitlife.ml.ActivityClassifier" -Dexec.args="data/workout_activities.arff"
   ```

   This will:
   - Load the dataset
   - Train a J48 decision tree classifier
   - Evaluate with 10-fold cross-validation
   - Save the model to `models/activity_classifier.model`
   - Display accuracy metrics

5. **Start the ML server:**
   
   **For PowerShell (Windows):**
   ```powershell
   mvn exec:java '-Dexec.mainClass=com.fitlife.ml.MLServer' '-Dexec.args=models/activity_classifier.model data/workout_activities.arff'
   ```
   
   **For Bash/Linux/Mac:**
   ```bash
   mvn exec:java -Dexec.mainClass="com.fitlife.ml.MLServer" -Dexec.args="models/activity_classifier.model data/workout_activities.arff"
   ```

   The ML server will run on `http://localhost:8080`

### 3. Environment Variables (Optional)

Create a `.env` file in the root directory:
```
VITE_ML_API_URL=http://localhost:8080/api/predict
```

## 📊 Firebase Indexes

Firebase Firestore requires composite indexes for queries that filter on multiple fields. The following indexes are **required** for optimal performance:

### Required Indexes

1. **Workouts by userId and date (descending)**
   - Collection: `workouts`
   - Fields:
     - `userId` (Ascending)
     - `date` (Descending)
   - Query scope: Collection
   - **Status**: ✅ Required (used by default workout list)

2. **Workouts by userId, activityType, and date (descending)**
   - Collection: `workouts`
   - Fields:
     - `userId` (Ascending)
     - `activityType` (Ascending)
     - `date` (Descending)
   - Query scope: Collection
   - **Status**: ✅ Required (used when filtering by activity type)

3. **Workouts by userId, duration, and date (descending)**
   - Collection: `workouts`
   - Fields:
     - `userId` (Ascending)
     - `duration` (Ascending)
     - `date` (Descending)
   - Query scope: Collection
   - **Status**: ⚠️ Optional (used when filtering by duration range)

4. **Workouts by userId, date range, and date (descending)**
   - Collection: `workouts`
   - Fields:
     - `userId` (Ascending)
     - `date` (Ascending) - for range queries
     - `date` (Descending) - for ordering
   - Query scope: Collection
   - **Status**: ⚠️ Optional (used when filtering by date range)

### How to Create Indexes

1. **Automatic (Recommended):**
   - When you run a query that needs an index, Firebase will show an error with a link
   - Click the link to automatically create the index
   - Wait 2-5 minutes for the index to build

2. **Manual:**
   - Go to Firebase Console → Firestore → Indexes tab
   - Click "Create Index"
   - Fill in the collection and fields as specified above
   - Click "Create"

### Index Status

- **Indexes 1-2**: Create these immediately for core functionality
- **Indexes 3-4**: Create when you start using advanced filters (Firebase will prompt you)

## 🔌 API Endpoints

### ML Service (Java Backend)

The ML service runs on `http://localhost:8080` and provides the following endpoints:

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "service": "FitLife ML Service"
}
```

#### 2. Predict Activity Type
```http
POST /api/predict
Content-Type: application/json
```

**Request Body:**
```json
{
  "duration": 30,
  "distance": 5.2,
  "calories": 320
}
```

**Response:**
```json
{
  "predictedActivity": "Running",
  "confidence": 0.85
}
```

**Parameters:**
- `duration` (required): Duration in minutes (number)
- `distance` (optional): Distance in kilometers (number, default: 0)
- `calories` (required): Calories burned (number)

**Activity Types:**
- `Running`
- `Cycling`
- `Walking`
- `Gym Workout`

### Frontend Services

The frontend uses Firebase services (not REST APIs):

#### Authentication Service (`authService.ts`)
- `registerUser(email, password, displayName?)` - Register new user
- `loginUser(email, password)` - Login user
- `logoutUser()` - Logout current user
- `getUserProfile(uid)` - Get user profile
- `updateUserProfile(uid, updates)` - Update user profile (displayName, weight, height)

#### Workout Service (`workoutService.ts`)
- `addWorkout(userId, workoutData)` - Create new workout
- `updateWorkout(workoutId, workoutData)` - Update existing workout
- `deleteWorkout(workoutId)` - Delete workout
- `getWorkouts(userId, filters?)` - Get workouts with optional filters
- `getWorkoutStats(userId, workouts)` - Calculate workout statistics

#### ML Service (`mlService.ts`)
- `predictActivityType(data)` - Predict activity type (calls ML backend or uses fallback)

## 🎮 Usage Guide

### User Workflow

1. **Registration/Login**
   - Navigate to `/register` to create a new account
   - Or use `/login` to sign in with existing credentials
   - After login, you're redirected to the dashboard

2. **Profile Setup**
   - Go to `/profile` to update your profile
   - Enter your display name
   - Enter your weight in kilograms (kg)
   - Enter your height in centimeters (cm)
   - Click "Save Changes"

3. **Logging Workouts**
   - Navigate to `/workouts`
   - Click "Add New Workout"
   - Fill in workout details:
     - Activity Type (or use "🤖 Predict Activity" for ML prediction)
     - Duration (minutes)
     - Distance (km) - optional, set to 0 for gym workouts
     - Calories burned
     - Date
     - Notes (optional)
   - Click "Save Workout"

4. **Viewing Dashboard**
   - The dashboard (`/dashboard`) shows:
     - Total workouts count
     - Total calories burned
     - Total duration (hours)
     - Total distance (km)
     - Workouts by activity type (chart)
     - Recent workouts list

5. **Filtering Workouts**
   - Go to `/workouts`
   - Click "Show Filters"
   - Filter by:
     - Activity Type
     - Duration range (min/max)
     - Date range (start/end)
   - Click "Apply Filters" or "Clear Filters"

6. **ML Predictions**
   - When adding/editing a workout, click "🤖 Predict Activity"
   - The system will predict the activity type based on duration, distance, and calories
   - If ML server is unavailable, it uses rule-based fallback

### ML Component Usage

1. **Training the Model**
   
   **PowerShell (Windows):**
   ```powershell
   cd ml-component
   mvn exec:java '-Dexec.mainClass=com.fitlife.ml.ActivityClassifier' '-Dexec.args=data/workout_activities.arff'
   ```
   
   **Bash/Linux/Mac:**
   ```bash
   cd ml-component
   mvn exec:java -Dexec.mainClass="com.fitlife.ml.ActivityClassifier" -Dexec.args="data/workout_activities.arff"
   ```

2. **Starting the Server**
   
   **PowerShell (Windows):**
   ```powershell
   mvn exec:java '-Dexec.mainClass=com.fitlife.ml.MLServer' '-Dexec.args=models/activity_classifier.model data/workout_activities.arff'
   ```
   
   **Bash/Linux/Mac:**
   ```bash
   mvn exec:java -Dexec.mainClass="com.fitlife.ml.MLServer" -Dexec.args="models/activity_classifier.model data/workout_activities.arff"
   ```

3. **Testing the API**
   ```bash
   # Health check
   curl http://localhost:8080/health

   # Prediction
   curl -X POST http://localhost:8080/api/predict \
     -H "Content-Type: application/json" \
     -d '{"duration": 30, "distance": 5.2, "calories": 320}'
   ```

## 🏗️ System Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture diagram and system design.

### High-Level Overview

```
┌─────────────────┐
│   React Frontend │
│   (Vite + TS)    │
└────────┬─────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
┌─────────────────┐  ┌──────────────┐
│  Firebase Auth  │  │  Firestore   │
│  & Firestore    │  │   Database   │
└─────────────────┘  └──────────────┘
         │
         │ (ML Predictions)
         ▼
┌─────────────────┐
│  Java ML Server │
│  (WEKA + Spark) │
│  Port: 8080     │
└─────────────────┘
```

## 🧪 Development

### Frontend Development

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### ML Component Development

```bash
cd ml-component
mvn clean compile    # Compile Java code
mvn test            # Run tests (if any)
mvn package         # Create JAR file
mvn exec:java ...   # Run specific class
```

### Testing the Application

1. **Test Authentication:**
   - Register a new user
   - Login with credentials
   - Logout

2. **Test Profile:**
   - Update display name
   - Add weight and height
   - Verify data persists

3. **Test Workouts:**
   - Add multiple workouts of different types
   - Edit a workout
   - Delete a workout
   - Filter workouts

4. **Test ML Service:**
   - Start ML server
   - Use "Predict Activity" button
   - Verify predictions match expected activity types

## 📝 Data Models

### User Profile
```typescript
{
  uid: string;
  email: string;
  displayName?: string;
  weight?: number;      // in kg
  height?: number;      // in cm
  createdAt: Date;
}
```

### Workout
```typescript
{
  id: string;
  userId: string;
  activityType: 'Running' | 'Cycling' | 'Walking' | 'Gym Workout';
  duration: number;     // in minutes
  distance?: number;    // in km
  calories: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔒 Security

- **Firebase Authentication**: Secure user authentication
- **Firestore Security Rules**: Users can only access their own data
- **Input Validation**: Frontend and backend validation
- **CORS**: ML server configured for local development

## 🐛 Troubleshooting

### Frontend Issues

**Firebase connection errors:**
- Verify Firebase config in `src/config/firebase.ts`
- Check Firebase project settings
- Ensure Firestore is enabled

**Index errors:**
- Firebase will show a link to create missing indexes
- Click the link and wait for index creation (2-5 minutes)

**Build errors:**
- Run `npm install` to ensure dependencies are installed
- Check Node.js version (18+)

### ML Component Issues

**Server won't start:**
- Verify model file exists: `models/activity_classifier.model`
- Verify dataset exists: `data/workout_activities.arff`
- Check Java version: `java -version` (should be 11+)
- Check port 8080 is available

**Connection refused:**
- Ensure ML server is running
- Check firewall settings
- Verify URL in `mlService.ts` matches server port

**Model prediction errors:**
- Ensure model was trained successfully
- Verify dataset format matches expected structure
- Check WEKA version compatibility

## 📚 Additional Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md) - Detailed Firebase configuration
- [ML Component README](./ml-component/README.md) - ML component documentation
- [ML Server Testing](./ml-component/TEST_SERVER.md) - Testing ML server endpoints

## 🎯 Future Enhancements

- [ ] BMI calculation based on weight/height
- [ ] Workout goals and progress tracking
- [ ] Social features (share workouts)
- [ ] Mobile app (React Native)
- [ ] Advanced ML models (neural networks)
- [ ] Real-time workout tracking
- [ ] Integration with fitness wearables

## 📄 License

This project is created for educational purposes.

## 👥 Contributing

This is an educational project. Feel free to fork and modify for your own learning purposes.

---

**Built with ❤️ using React, TypeScript, Firebase, and WEKA**
