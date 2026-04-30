export default function EmptyState({ isFiltered }) {
  return (
    <section
      style={{
        background: 'linear-gradient(180deg, rgba(24,28,39,0.96), rgba(24,28,39,0.9))',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 32px',
        textAlign: 'center',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div style={{ fontSize: 42, marginBottom: 14 }}>📭</div>
      <h2 style={{ fontSize: 20, color: 'var(--text-primary)', marginBottom: 8 }}>
        {isFiltered ? 'No matching orders' : 'No orders available'}
      </h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
        {isFiltered
          ? 'Try adjusting filters or clearing the search to reveal orders that match your current view.'
          : 'Orders will appear here once they are created or synchronized from the connected system.'}
      </p>
    </section>
  )
}