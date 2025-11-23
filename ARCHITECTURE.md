# FitLife System Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER (Browser)                             │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    React Frontend Application                        │   │
│  │                    (Vite + TypeScript + React 19)                    │   │
│  │                                                                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │   │
│  │  │   Auth       │  │  Dashboard   │  │   Workouts   │             │   │
│  │  │  Components  │  │  Components  │  │  Components  │             │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │   │
│  │                                                                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │   │
│  │  │   Profile    │  │  Prediction  │  │   Layout     │             │   │
│  │  │  Component   │  │   Page       │  │  (Navbar)    │             │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │   │
│  │                                                                       │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │                    Service Layer                             │   │   │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │   │   │
│  │  │  │ authService  │  │workoutService│  │  mlService   │       │   │   │
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘       │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
        ┌──────────────────┐ ┌──────────────┐ ┌──────────────┐
        │  Firebase Auth   │ │  Firestore   │ │  ML Service  │
        │  (Authentication)│ │  (Database)  │ │  (Java/WEKA) │
        └──────────────────┘ └──────────────┘ └──────────────┘
                                    │               │
                                    │               │
                                    ▼               ▼
                            ┌──────────────┐ ┌──────────────┐
                            │   Users       │ │  ML Model     │
                            │   Collection │ │  (J48 Tree)   │
                            │              │ │              │
                            │   Workouts   │ │  Dataset     │
                            │   Collection │ │  (ARFF)      │
                            └──────────────┘ └──────────────┘
```

## Component Architecture

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      React Application                       │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              App.tsx (Router)                          │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │ /login   │  │ /register│  │ /dashboard│           │ │
│  │  └──────────┘  └──────────┘  └──────────┘            │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │ /workouts│  │ /profile │  │ /prediction│          │ │
│  │  └──────────┘  └──────────┘  └──────────┘            │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Component Hierarchy                       │ │
│  │                                                         │ │
│  │  Layout/                                                │ │
│  │    └── Navbar (Navigation + Auth State)                │ │
│  │                                                         │ │
│  │  Auth/                                                  │ │
│  │    ├── Login (Email/Password)                          │ │
│  │    └── Register (Email/Password/DisplayName)          │ │
│  │                                                         │ │
│  │  Dashboard/                                             │ │
│  │    ├── Dashboard (Main Dashboard Page)                 │ │
│  │    ├── StatsCards (Total Stats Display)                │ │
│  │    ├── ActivityChart (Recharts Visualization)          │ │
│  │    └── RecentWorkouts (Recent Workouts List)            │ │
│  │                                                         │ │
│  │  Profile/                                               │ │
│  │    └── Profile (Edit Name, Weight, Height)             │ │
│  │                                                         │ │
│  │  Workout/                                               │ │
│  │    ├── WorkoutForm (Add/Edit Workout + ML Prediction)  │ │
│  │    └── WorkoutList (Display + Filter Workouts)         │ │
│  │                                                         │ │
│  │  pages/                                                 │ │
│  │    ├── Workouts (Workout Management Page)              │ │
│  │    └── Prediction (ML Prediction Testing Page)        │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Service Layer                             │ │
│  │                                                         │ │
│  │  authService.ts                                         │ │
│  │    ├── registerUser()                                  │ │
│  │    ├── loginUser()                                     │ │
│  │    ├── logoutUser()                                    │ │
│  │    ├── getUserProfile()                                │ │
│  │    └── updateUserProfile()                             │ │
│  │                                                         │ │
│  │  workoutService.ts                                      │ │
│  │    ├── addWorkout()                                    │ │
│  │    ├── updateWorkout()                                 │ │
│  │    ├── deleteWorkout()                                 │ │
│  │    ├── getWorkouts()                                   │ │
│  │    └── getWorkoutStats()                               │ │
│  │                                                         │ │
│  │  mlService.ts                                           │ │
│  │    └── predictActivityType()                           │ │
│  │        ├── Calls Java ML Server (if available)         │ │
│  │        └── Falls back to rule-based prediction        │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Backend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Services                         │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Firebase Authentication                   │ │
│  │                                                         │ │
│  │  • Email/Password Authentication                       │ │
│  │  • User Session Management                             │ │
│  │  • Secure Token Generation                             │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Firestore Database                        │ │
│  │                                                         │ │
│  │  Collections:                                          │ │
│  │                                                         │ │
│  │  users/                                                │ │
│  │    {userId}/                                           │ │
│  │      - uid: string                                     │ │
│  │      - email: string                                   │ │
│  │      - displayName?: string                            │ │
│  │      - weight?: number (kg)                           │ │
│  │      - height?: number (cm)                           │ │
│  │      - createdAt: Timestamp                           │ │
│  │                                                         │ │
│  │  workouts/                                             │ │
│  │    {workoutId}/                                        │ │
│  │      - id: string                                      │ │
│  │      - userId: string                                  │ │
│  │      - activityType: string                            │ │
│  │      - duration: number                                │ │
│  │      - distance?: number                              │ │
│  │      - calories: number                               │ │
│  │      - date: Timestamp                                │ │
│  │      - notes?: string                                 │ │
│  │      - createdAt: Timestamp                           │ │
│  │      - updatedAt: Timestamp                           │ │
│  │                                                         │ │
│  │  Indexes:                                              │ │
│  │    • workouts: userId + date (desc)                   │ │
│  │    • workouts: userId + activityType + date (desc)    │ │
│  │    • workouts: userId + duration + date (desc)        │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    ML Service (Java)                          │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              MLServer (REST API)                       │ │
│  │              Port: 8080                                │ │
│  │                                                         │ │
│  │  Endpoints:                                            │ │
│  │    GET  /health                                        │ │
│  │    POST /api/predict                                   │ │
│  └───────────────────────────────────────────────────────┘ │
│                      │                                       │
│                      ▼                                       │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              MLService                                  │ │
│  │                                                         │ │
│  │  • Load trained model                                   │ │
│  │  • Preprocess input data                                │ │
│  │  • Make predictions                                     │ │
│  │  • Calculate confidence scores                          │ │
│  └───────────────────────────────────────────────────────┘ │
│                      │                                       │
│                      ▼                                       │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              WEKA Library                               │ │
│  │                                                         │ │
│  │  • J48 Decision Tree Classifier                        │ │
│  │  • Model Loading & Evaluation                          │ │
│  │  • Instance Creation & Classification                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                      │                                       │
│                      ▼                                       │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Model & Dataset                            │ │
│  │                                                         │ │
│  │  models/activity_classifier.model                       │ │
│  │  data/workout_activities.arff                          │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### User Registration Flow

```
User Input
    │
    ▼
Register Component
    │
    ▼
authService.registerUser()
    │
    ├─────────────────┐
    │                 │
    ▼                 ▼
Firebase Auth    Firestore
(create user)    (create profile)
    │                 │
    └────────┬────────┘
             │
             ▼
    Redirect to Dashboard
```

### Workout Creation Flow

```
User Input (Workout Form)
    │
    ▼
WorkoutForm Component
    │
    ├──────────────────────┐
    │                      │
    ▼                      ▼
ML Prediction?      Direct Entry
    │                      │
    ▼                      │
mlService.predictActivityType()
    │                      │
    ├─── ML Server ────┐   │
    │   (if available) │   │
    │                  │   │
    └─── Fallback ─────┘   │
    │                      │
    ▼                      ▼
workoutService.addWorkout()
    │
    ▼
Firestore (workouts collection)
    │
    ▼
Update Dashboard Stats
```

### Workout Query Flow

```
User Request (with filters)
    │
    ▼
WorkoutList Component
    │
    ▼
workoutService.getWorkouts(userId, filters)
    │
    ▼
Firestore Query
    │
    ├─── userId filter ────┐
    ├─── activityType ─────┤
    ├─── duration range ────┤ (if specified)
    ├─── date range ────────┤
    └─── orderBy date ──────┘
    │
    ▼
Firestore Indexes (if needed)
    │
    ▼
Return Workouts Array
    │
    ▼
Display in UI
```

### ML Prediction Flow

```
Frontend Request
    │
    ▼
mlService.predictActivityType(data)
    │
    ├─── Try ML Server ────┐
    │   (http://localhost:8080/api/predict)
    │                      │
    │   ┌──────────────────┘
    │   │
    │   ▼
    │   MLServer (Java)
    │       │
    │       ▼
    │   MLService
    │       │
    │       ▼
    │   WEKA Classifier
    │       │
    │       ▼
    │   Return Prediction
    │
    └─── Fallback (if error) ────┐
                                 │
                                 ▼
                        Rule-based Prediction
                        (speed-based logic)
                                 │
                                 ▼
                        Return Prediction
```

## Technology Stack Details

### Frontend Stack
- **Vite**: Build tool, HMR, fast dev server
- **React 19**: UI library with hooks
- **TypeScript**: Type safety
- **React Router DOM**: Client-side routing
- **Firebase SDK**: Authentication & Firestore client
- **React Firebase Hooks**: Firebase integration
- **Recharts**: Chart visualization
- **Date-fns**: Date utilities

### Backend Stack
- **Firebase Authentication**: User management
- **Firestore**: NoSQL database
- **Java 11+**: ML service runtime
- **WEKA 3.8.6**: Machine learning library
- **Spark Java**: REST API framework
- **Maven**: Build & dependency management
- **Gson**: JSON processing

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
│                                                               │
│  1. Firebase Authentication                                  │
│     • Email/Password validation                              │
│     • Secure token generation                                │
│     • Session management                                     │
│                                                               │
│  2. Firestore Security Rules                                 │
│     • User can only read/write own data                      │
│     • Authenticated users only                               │
│     • Field-level validation                                 │
│                                                               │
│  3. Frontend Validation                                      │
│     • Input type checking                                    │
│     • Range validation (non-negative)                       │
│     • Date validation                                        │
│                                                               │
│  4. CORS Configuration                                        │
│     • ML server CORS for localhost                           │
│     • Production CORS restrictions                            │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

### Development Environment
```
Local Machine
├── Frontend (Vite Dev Server) - Port 5173
├── ML Service (Java/Spark) - Port 8080
└── Firebase (Cloud Service)
    ├── Authentication
    └── Firestore
```

### Production Environment (Recommended)
```
┌─────────────────────────────────────────────────────────────┐
│                    Cloud Infrastructure                      │
│                                                               │
│  Frontend Hosting:                                           │
│    • Vercel / Netlify / Firebase Hosting                     │
│    • Static site hosting                                     │
│                                                               │
│  ML Service:                                                 │
│    • AWS EC2 / Google Cloud Run / Heroku                    │
│    • Containerized Java application                          │
│                                                               │
│  Database & Auth:                                            │
│    • Firebase (Cloud Service)                                │
│    • Firestore (NoSQL Database)                              │
│    • Firebase Authentication                                 │
└─────────────────────────────────────────────────────────────┘
```

## Performance Considerations

1. **Firestore Indexes**: Composite indexes for efficient queries
2. **Lazy Loading**: Components loaded on demand
3. **Caching**: Firebase SDK handles caching automatically
4. **ML Service**: Model loaded once at startup
5. **Fallback System**: Rule-based prediction when ML unavailable

## Scalability

- **Frontend**: Stateless, can scale horizontally
- **Firebase**: Auto-scales with usage
- **ML Service**: Can be containerized and scaled
- **Database**: Firestore handles scaling automatically

---

**Note**: This architecture supports both development and production deployments with minimal changes.

