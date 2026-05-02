import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Explicit service account JSON (e.g. CI/CD)
    initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
  } else if (process.env.NODE_ENV === 'development') {
    // Local dev: use service-account-key.json
    try {
      const sa = require('../../service-account-key.json');
      initializeApp({ credential: cert(sa) });
    } catch {
      // Fall back to ADC even in dev
      initializeApp({ credential: applicationDefault() });
    }
  } else {
    // Firebase App Hosting / Cloud Run: use ADC (auto-provided)
    initializeApp({ credential: applicationDefault() });
  }
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
