# Firebase Setup Instructions

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "cancer-treatment-app")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click "Enable" and save
   - **Google**: Click "Enable", add your authorized domain, and save

## 3. Set up Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

## 4. Get Your Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "cancer-treatment-web")
6. Copy the Firebase configuration object

## 5. Update Your Firebase Configuration

Replace the placeholder values in `src/config/firebase.ts` with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};
```

## 6. Set up Firestore Security Rules

In your Firestore Database, go to the "Rules" tab and update the rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 7. Test Your Setup

1. Run your development server: `npm run dev`
2. Try creating an account on the signin page
3. Try logging in with the created account
4. Test Google sign-in functionality

## Features Implemented

- ✅ Email/Password authentication
- ✅ Google sign-in
- ✅ User data storage in Firestore
- ✅ Protected routes
- ✅ User profile dropdown in navbar
- ✅ Automatic redirects based on authentication state
- ✅ Error handling for authentication failures

## Security Notes

- The current Firestore rules allow users to read/write only their own data
- For production, consider implementing additional security measures
- Always use environment variables for Firebase config in production
