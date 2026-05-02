import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await adminAuth.verifyIdToken(authHeader.slice(7));
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const { recipientId, taskId, projectId, taskTitle, actorName } = await req.json();
    if (!recipientId || !taskId || !projectId || !taskTitle) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    await adminDb.collection('notifications').add({
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
