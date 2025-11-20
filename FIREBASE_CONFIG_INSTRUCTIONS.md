# ⚠️ IMPORTANT: Update Your Firebase Configuration

You're seeing errors because your Firebase configuration still has placeholder values.

## Quick Fix

1. **Go to Firebase Console**
   - Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Select your project

2. **Get Your Config**
   - Click the gear icon (⚙️) → "Project settings"
   - Scroll to "Your apps" section
   - If you don't have a web app, click the `</>` icon to add one
   - Copy the `firebaseConfig` object

3. **Update `src/config/firebase.ts`**
   - Open `src/config/firebase.ts`
   - Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSy...",  // ← Replace this
  authDomain: "your-project-id.firebaseapp.com",  // ← Replace this
  projectId: "your-project-id",  // ← Replace this
  storageBucket: "your-project-id.appspot.com",  // ← Replace this
  messagingSenderId: "123456789",  // ← Replace this
  appId: "1:123456789:web:abcdef"  // ← Replace this
};
```

4. **Restart Your Dev Server**
   - Stop the server (Ctrl+C)
   - Run `npm run dev` again

## Current Error

The error `key=your-api-key` means you're using placeholder values. Firebase needs your actual project credentials to work.

## After Updating

Once you update the config with real values:
- ✅ Authentication will work
- ✅ Database operations will work
- ✅ No more 400 Bad Request errors

See `FIREBASE_SETUP.md` for complete setup instructions.

