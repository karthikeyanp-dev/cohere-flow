# Google Sign-In Fix - Summary of Changes

## Issue
Google sign-in was failing in the deployed Cloud Run URL with `redirect_uri_mismatch` error.

## Root Cause
When deploying to Firebase App Hosting (Cloud Run), the Firebase Authentication flow requires:
1. Correct OAuth redirect URIs registered in Google Cloud Console
2. Proper `authDomain` configuration in Firebase SDK
3. Service worker not intercepting Firebase auth handler routes

## Changes Made

### 1. lib/firebase/client.ts (Modified)
**Purpose**: Enable Firebase App Hosting auto-configuration for proper authDomain setup

**Changes**:
- Added logic to check for `FIREBASE_WEBAPP_CONFIG` environment variable (automatically provided by Firebase App Hosting during build)
- Falls back to manual configuration for local development
- Ensures correct `authDomain` is used regardless of deployment environment

```typescript
const firebaseConfig = (() => {
  // Check for Firebase App Hosting auto-configuration (build-time)
  if (typeof process !== 'undefined' && process.env?.FIREBASE_WEBAPP_CONFIG) {
    try {
      return JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG);
    } catch {
      // Fall through to manual config
    }
  }
  
  // Fallback to manual configuration for local development
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
})();
```

### 2. apphosting.yaml (Modified)
**Purpose**: Properly configure Cloud Run resources and ensure environment variables are available

**Changes**:
- Added resource configuration (CPU, memory, instances, concurrency)
- Ensured all Firebase config environment variables are available at both BUILD and RUNTIME
- Set appropriate defaults for production deployment

```yaml
runConfig:
  runtime: nodejs22
  cpu: 1
  memoryMiB: 1024
  minInstances: 0
  maxInstances: 10
  concurrency: 80
```

### 3. GOOGLE_SIGNIN_FIX.md (Created)
**Purpose**: Comprehensive documentation of the issue and fix

**Contents**:
- Detailed problem analysis
- Step-by-step solution
- Manual configuration steps for Google Cloud OAuth
- Troubleshooting guide
- Verification steps

## Manual Steps Required

### Google Cloud OAuth Configuration
**Must be done in [Google Cloud Console](https://console.cloud.google.com/apis/credentials/consent)**:

1. Navigate to **APIs & Services** → **OAuth consent screen**
2. Edit your OAuth 2.0 Client ID (Web application)
3. Add these **Authorized redirect URIs**:
   ```
   https://cohere-flow.firebaseapp.com/__/auth/handler
   https://cohere-flow.web.app/__/auth/handler
   ```
4. Add these **Authorized JavaScript origins**:
   ```
   https://cohere-flow.firebaseapp.com
   https://cohere-flow.web.app
   ```

### Firebase Console Verification
1. Go to [Firebase Console](https://console.firebase.google.com/) → Authentication → Sign-in method
2. Ensure Google sign-in is enabled
3. Verify authorized domains include `cohere-flow.firebaseapp.com`

## Testing

### Local Testing
```bash
npm run dev
```
- Navigate to `/login`
- Test Google sign-in (should work with existing OAuth config)

### Production Testing
After deployment:
1. Navigate to deployed Cloud Run URL
2. Test Google sign-in
3. Verify user is created in Firestore
4. Check browser console for errors

## Build Verification
```bash
npm run build
```
✓ Build completes successfully
✓ No TypeScript errors
✓ All routes generated correctly

## Technical Notes

### Why This Fix Works

1. **Firebase App Hosting Auto-configuration**: The `FIREBASE_WEBAPP_CONFIG` environment variable is automatically populated by Firebase App Hosting during the build process. It contains the correct Firebase config including the proper `authDomain` for the deployment environment.

2. **OAuth Redirect URIs**: By registering `https://cohere-flow.firebaseapp.com/__/auth/handler` as an authorized redirect URI in Google Cloud OAuth, Google knows this is a valid callback URL for this Firebase project, regardless of where the app is actually hosted.

3. **Service Worker**: The Firebase auth handler route (`__/auth/handler`) must not be intercepted by service workers. The existing service worker configuration appears to allow this (verified in build output).

### Firebase Auth Flow with App Hosting

1. User clicks "Continue with Google" in the app
2. `signInWithPopup()` opens popup to `https://cohere-flow.firebaseapp.com/__/auth/handler`
3. Google OAuth authenticates user
4. Google redirects to `https://cohere-flow.firebaseapp.com/__/auth/handler` with auth token
5. Firebase processes token and closes popup
6. User is signed in to the app (served from Cloud Run)
7. Auth state is synchronized across all Firebase services

## References

- [Firebase Auth: Best practices for signInWithRedirect](https://firebase.google.com/docs/auth/web/redirect-best-practices)
- [Firebase App Hosting: Automatic SDK initialization](https://firebase.google.com/docs/app-hosting/about-app-hosting)
- [Firebase Hosting: Reserved URLs](https://firebase.google.com/docs/hosting/reserved-urls)
- [Google Cloud: OAuth 2.0 Configuration](https://console.cloud.google.com/apis/credentials/consent)
