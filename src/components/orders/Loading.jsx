export default function Loading() {
  return (
    <section
      aria-busy="true"
      role="status"
      style={{
        background: 'linear-gradient(180deg, rgba(30,35,51,0.92), rgba(24,28,39,0.98))',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 18px var(--accent-glow)' }} />
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Loading orders...</div>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {[1, 2, 3].map(index => (
          <div key={index} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 120px', gap: 16, padding: '14px 16px', background: 'var(--surface)', borderRadius: 12 }}>
            <div style={{ height: 12, borderRadius: 999, background: 'linear-gradient(90deg, var(--surface-2) 25%, var(--border) 50%, var(--surface-2) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
            <div style={{ height: 12, borderRadius: 999, background: 'linear-gradient(90deg, var(--surface-2) 25%, var(--border) 50%, var(--surface-2) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
            <div style={{ height: 12, borderRadius: 999, background: 'linear-gradient(90deg, var(--surface-2) 25%, var(--border) 50%, var(--surface-2) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </section>
  )
}