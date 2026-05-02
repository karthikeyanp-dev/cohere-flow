'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      setError('Failed to send reset email. Check the address and try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="glass rounded-2xl p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
             style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h10M4 18h6" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Cohere Flow</span>
      </div>

      {sent ? (
        <div className="text-center py-4">
          <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: '#34d399' }}/>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Check your inbox</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            We sent a reset link to <strong>{email}</strong>
          </p>
          <Link href="/login" className="text-sm font-medium hover:underline" style={{ color: 'var(--brand)' }}>
            Back to Sign In
          </Link>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Reset password</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Enter your email and we&apos;ll send you a reset link.
          </p>
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm"
                 style={{ background: 'rgba(244,63,94,0.1)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.3)' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
              {loading && <Loader2 size={16} className="animate-spin"/>}
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
            <Link href="/login" className="hover:underline" style={{ color: 'var(--brand)' }}>← Back to Sign In</Link>
          </p>
        </>
      )}
    </div>
  );
}
