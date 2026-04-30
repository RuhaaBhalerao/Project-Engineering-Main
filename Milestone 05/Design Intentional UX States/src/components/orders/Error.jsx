export default function ErrorState({ message }) {
  return (
    <section
      role="alert"
      style={{
        background: 'linear-gradient(180deg, rgba(46,18,24,0.9), rgba(24,28,39,0.98))',
        border: '1px solid rgba(239,68,68,0.24)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px 32px',
        textAlign: 'center',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div style={{ fontSize: 42, marginBottom: 14 }}>⚠️</div>
      <h2 style={{ fontSize: 20, color: 'var(--text-primary)', marginBottom: 8 }}>Could not load orders</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
        {message}
      </p>
      <p style={{ marginTop: 14, color: 'var(--text-muted)', fontSize: 13 }}>
        Check the API connection and try the refresh action again.
      </p>
    </section>
  )
}