export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
         style={{ background: 'var(--bg-base)' }}>
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
           style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl"
           style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
