# Firebase App Hosting Deployment Guide

## Current Status

✅ **Code Changes**: Committed and pushed to GitHub  
✅ **Firebase App Hosting**: Connected to GitHub repository  
✅ **OAuth Configuration**: Updated (web.app URLs added)  

## Deployment Information

### App URL
**Current**: https://cohere-flow--cohere-flow.asia-southeast1.hosted.app

### Repository
- **GitHub Repo**: karthikeyanp-dev-cohere-flow
- **Branch**: main
- **Auto-Deploy**: Enabled

## How Firebase App Hosting Deployment Works

Firebase App Hosting is configured to automatically deploy when you push code to the connected GitHub repository. The deployment process:

1. You push code to GitHub
2. Firebase detects the change
3. Cloud Build creates a new container image
4. Cloud Run deploys the new version
5. Traffic is switched to the new version

**Typical deployment time**: 2-5 minutes

## Manual Deployment Trigger

Since you've already pushed the code, the deployment should trigger automatically. If you want to ensure a new deployment:

### Option 1: Make Another Commit (Quickest)
```bash
# Make a small change or just update the timestamp
echo "# Last deployed: $(date)" >> DEPLOYMENT_LOG.md
git add DEPLOYMENT_LOG.md
git commit -m "chore: trigger deployment"
git push origin main
```

### Option 2: Wait for Auto-Deployment
- The system should detect your push within 1-2 minutes
- Check deployment status in Firebase Console

### Option 3: Use GitHub Actions (if configured)
If you have GitHub Actions workflow, it will trigger on push to main branch.

## Verify Deployment

### 1. Check Build Status
```bash
firebase apphosting:backends:list --project=cohere-flow
```

Look for the "Updated Date" to see when the last deployment occurred.

### 2. Test the App
Visit: https://cohere-flow--cohere-flow.asia-southeast1.hosted.app

### 3. Test Google Sign-In
1. Navigate to `/login`
2. Click "Continue with Google"
3. Should complete without `redirect_uri_mismatch` error

### 4. Check Browser Console
- No CORS errors
- No `redirect_uri_mismatch` errors
- Firebase auth completes successfully

## Local Testing (Before Deployment)

```bash
# Run development server
npm run dev

# Open http://localhost:3000/login
# Test Google sign-in locally
```

## Troubleshooting

### Deployment Not Starting
1. Check GitHub repository connection in Firebase Console
2. Verify the repository has the latest commits
3. Check Firebase App Hosting settings

### Build Failing
1. Check build logs in Firebase Console
2. Run `npm run build` locally to verify
3. Check for any TypeScript errors

### Google Sign-In Still Failing
1. Verify OAuth redirect URIs in Google Cloud Console:
   - `https://cohere-flow.firebaseapp.com/__/auth/handler`
   - `https://cohere-flow.web.app/__/auth/handler`
2. Ensure OAuth consent screen is published
3. Check browser console for specific errors

## Rollback (if needed)

Firebase App Hosting keeps previous versions. To rollback:

1. Go to Firebase Console → App Hosting
2. Find the previous deployment
3. Click "Rollback" to restore

## Monitoring

- **Firebase Console**: https://console.firebase.google.com/project/cohere-flow
- **App Hosting Dashboard**: View deployments, logs, and metrics
- **Cloud Run**: View service details and logs

## Important Notes

✅ **OAuth Configuration**: You've added the web.app URLs to Google Cloud OAuth  
✅ **Code Changes**: All fixes are committed and pushed  
⏳ **Deployment**: Should trigger automatically within 2-5 minutes  

## Next Steps

1. Wait for auto-deployment (2-5 minutes)
2. Test the app at the deployed URL
3. Verify Google sign-in works
4. Check Firestore for user creation
5. Monitor logs for any errors

## Support

If deployment doesn't start automatically:
- Check Firebase Console for any alerts
- Verify GitHub repository connection
- Try making another commit to trigger deployment
