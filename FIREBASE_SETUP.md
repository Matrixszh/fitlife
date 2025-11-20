# Firebase Setup Guide for FitLife

Complete step-by-step guide to set up Firebase for the FitLife application.

## Step 1: Create a Firebase Project

1. **Go to Firebase Console**
   - Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Sign in with your Google account

2. **Create a New Project**
   - Click "Add project" or "Create a project"
   - Enter project name: `fitlife` (or your preferred name)
   - Click "Continue"

3. **Configure Google Analytics (Optional)**
   - You can enable or disable Google Analytics
   - Click "Continue" (you can skip this)

4. **Complete Project Creation**
   - Wait for the project to be created
   - Click "Continue" when ready

## Step 2: Enable Authentication

1. **Navigate to Authentication**
   - In the left sidebar, click "Authentication"
   - Click "Get started"

2. **Enable Email/Password Authentication**
   - Click on the "Sign-in method" tab
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 3: Create Firestore Database

1. **Navigate to Firestore Database**
   - In the left sidebar, click "Firestore Database"
   - Click "Create database"

2. **Choose Security Rules Mode**
   - Select "Start in test mode" (we'll update rules later)
   - Click "Next"

3. **Choose Location**
   - Select a location closest to your users (e.g., `us-central`, `europe-west`, etc.)
   - Click "Enable"

4. **Wait for Database Creation**
   - This may take a minute or two
   - Once ready, you'll see the Firestore Database interface

## Step 4: Configure Firestore Security Rules

1. **Navigate to Rules**
   - In the Firestore Database page, click on the "Rules" tab

2. **Update Security Rules**
   - Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection - users can read/write their own profile
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId);
      allow delete: if isOwner(userId);
    }
    
    // Workouts collection - users can read/write their own workouts
    match /workouts/{workoutId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
  }
}
```

3. **Publish Rules**
   - Click "Publish" to save the rules
   - Wait for confirmation

## Step 5: Create Firestore Indexes

1. **Navigate to Indexes**
   - In the Firestore Database page, click on the "Indexes" tab

2. **Create Composite Indexes**
   
   The application will automatically prompt you to create indexes when needed, but you can create them manually:

   **Index 1: Workouts by userId and date (descending)**
   - Click "Create Index"
   - Collection ID: `workouts`
   - Fields to index:
     - Field: `userId`, Order: Ascending
     - Field: `date`, Order: Descending
   - Query scope: Collection
   - Click "Create"

   **Index 2: Workouts by userId, activityType, and date (descending)**
   - Click "Create Index"
   - Collection ID: `workouts`
   - Fields to index:
     - Field: `userId`, Order: Ascending
     - Field: `activityType`, Order: Ascending
     - Field: `date`, Order: Descending
   - Query scope: Collection
   - Click "Create"

   **Index 3: Workouts by userId, duration, and date (descending)**
   - Click "Create Index"
   - Collection ID: `workouts`
   - Fields to index:
     - Field: `userId`, Order: Ascending
     - Field: `duration`, Order: Ascending
     - Field: `date`, Order: Descending
   - Query scope: Collection
   - Click "Create"

   **Index 4: Workouts by userId, date range, and date (descending)**
   - Click "Create Index"
   - Collection ID: `workouts`
   - Fields to index:
     - Field: `userId`, Order: Ascending
     - Field: `date`, Order: Ascending
     - Field: `date`, Order: Descending (add this as a second field)
   - Query scope: Collection
   - Click "Create"

   **Note:** You can also wait for Firebase to automatically prompt you to create indexes when you run queries that need them.

## Step 6: Get Firebase Configuration

1. **Navigate to Project Settings**
   - Click the gear icon (⚙️) next to "Project Overview" in the left sidebar
   - Select "Project settings"

2. **Get Web App Configuration**
   - Scroll down to "Your apps" section
   - If you don't have a web app, click the `</>` (web) icon
   - Register your app:
     - App nickname: `FitLife Web App` (optional)
     - Firebase Hosting: Not set up (you can skip this)
     - Click "Register app"

3. **Copy Firebase Configuration**
   - You'll see your Firebase configuration object
   - It should look like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```

4. **Update Your Application**
   - Open `src/config/firebase.ts` in your project
   - Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 7: Test Your Setup

1. **Start Your Application**
   ```bash
   npm run dev
   ```

2. **Test Authentication**
   - Try registering a new user
   - Try logging in
   - Check Firebase Console → Authentication to see the user

3. **Test Database**
   - Add a workout in your app
   - Check Firebase Console → Firestore Database to see the data

## Step 8: (Optional) Set Up Firebase Hosting

If you want to deploy your app:

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   ```
   - Select your project
   - Public directory: `dist` (Vite's build output)
   - Configure as single-page app: Yes
   - Set up automatic builds: No (unless using CI/CD)

4. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## Security Best Practices

1. **Never commit your Firebase config with sensitive data to public repos**
   - Use environment variables for production
   - The current setup is fine for development

2. **Review Security Rules Regularly**
   - Make sure rules are restrictive enough
   - Test rules using the Rules Playground in Firebase Console

3. **Monitor Usage**
   - Check Firebase Console regularly for unexpected usage
   - Set up billing alerts if needed

## Troubleshooting

### Issue: "Permission denied" errors
- **Solution:** Check your Firestore security rules
- Make sure the user is authenticated
- Verify the rules match your data structure

### Issue: Index errors
- **Solution:** Firebase will show you a link to create the required index
- Click the link and create the index
- Wait a few minutes for the index to build

### Issue: Authentication not working
- **Solution:** 
  - Verify Email/Password is enabled in Authentication settings
  - Check that your Firebase config is correct
  - Check browser console for errors

### Issue: Data not appearing in Firestore
- **Solution:**
  - Check that you're looking at the correct database (not a different project)
  - Verify security rules allow write access
  - Check browser console for errors

## Quick Reference

- **Firebase Console:** [https://console.firebase.google.com/](https://console.firebase.google.com/)
- **Firestore Rules:** Firestore Database → Rules tab
- **Firestore Indexes:** Firestore Database → Indexes tab
- **Authentication:** Authentication → Sign-in method tab
- **Project Settings:** Gear icon → Project settings

## Next Steps

After completing this setup:
1. ✅ Your Firebase project is created
2. ✅ Authentication is enabled
3. ✅ Firestore database is ready
4. ✅ Security rules are configured
5. ✅ Your app is connected to Firebase

You can now use the FitLife application with full Firebase integration!

