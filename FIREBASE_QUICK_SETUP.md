# Firebase Quick Setup Checklist

Use this checklist to quickly set up Firebase for FitLife.

## ✅ Setup Checklist

- [ ] **Step 1:** Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
- [ ] **Step 2:** Enable Authentication → Email/Password
- [ ] **Step 3:** Create Firestore Database (Start in test mode)
- [ ] **Step 4:** Update Firestore Security Rules (see below)
- [ ] **Step 5:** Create Firestore Indexes (optional - Firebase will prompt you)
- [ ] **Step 6:** Copy Firebase config to `src/config/firebase.ts`
- [ ] **Step 7:** Test registration and login

## 🔒 Firestore Security Rules

Copy and paste these rules in Firestore → Rules tab:

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

## 📋 Required Firestore Collections

Your app uses these collections:
- `users` - User profiles
- `workouts` - Workout records

## 🔑 Firebase Config Location

Update: `src/config/firebase.ts`

Get your config from: Firebase Console → Project Settings → Your apps → Web app

## 🚀 Quick Start Commands

```bash
# After Firebase setup, start your app
npm run dev

# Test in browser:
# 1. Register a new account
# 2. Add a workout
# 3. Check Firebase Console to see the data
```

## 📚 Full Guide

See `FIREBASE_SETUP.md` for detailed step-by-step instructions.

