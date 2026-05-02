import { NextRequest, NextResponse } from 'next/server';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recipientId, taskId, projectId, taskTitle, actorName } = body;

    if (!recipientId || !taskId || !projectId || !taskTitle) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await addDoc(collection(db, 'notifications'), {
      recipientId,
      type: 'task_assigned',
      taskId,
      projectId,
      taskTitle,
      actorName: actorName || 'Someone',
      read: false,
      createdAt: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Notification error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
