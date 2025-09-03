# Firebase Authentication Setup Guide

## Problem: Account creation not happening

This is likely because Firebase Authentication is not properly configured in the Firebase Console.

## Steps to Fix:

### 1. Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project "donate-6f850"
3. In the left sidebar, click on "Authentication"
4. Click on "Get started" if you see it
5. Go to the "Sign-in method" tab
6. Enable "Email/Password" provider:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

### 2. Check Firebase Security Rules

1. Go to "Firestore Database" in the Firebase Console
2. Click on "Rules" tab
3. Make sure you have proper rules, for testing you can use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow all authenticated users to read/write donations (for now)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Test the App

1. Open the web version at http://localhost:8081
2. Look for the "Debug Firebase" section
3. Try the "Test Firebase Connection" button first
4. Then try "Test Sign Up" with a new email

### 4. Check Browser Console

1. Open Developer Tools in your browser (F12)
2. Go to Console tab
3. Look for any error messages when trying to create an account

## Common Error Messages and Solutions:

- **"auth/operation-not-allowed"**: Email/Password is not enabled in Firebase Console
- **"auth/weak-password"**: Password should be at least 6 characters
- **"auth/email-already-in-use"**: Try with a different email address
- **"auth/invalid-email"**: Check email format
- **Network errors**: Check internet connection

## Quick Test:

Try creating an account with:
- Email: test123@example.com
- Password: password123
- Any role and name

If it still doesn't work, check the browser console for specific error messages.
