const STATUS_CONFIG = {
  Delivered: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', dot: '#10b981' },
  Shipped: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', dot: '#3b82f6' },
  Processing: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', dot: '#f59e0b' },
  Pending: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', dot: '#8b5cf6' },
  Cancelled: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', dot: '#ef4444' },
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)
}

export default function Success({ orders }) {
  const totalOrders = orders.length
  const totalValue = orders.reduce((sum, order) => sum + order.amount, 0)
  const statusCount = orders.reduce((accumulator, order) => {
    accumulator[order.status] = (accumulator[order.status] || 0) + 1
    return accumulator
  }, {})

  return (
    <section style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
        {[
          { label: 'Total Orders', value: totalOrders, icon: '📦', color: 'var(--accent)' },
          { label: 'Total Value', value: `₹${formatCurrency(totalValue)}`, icon: '💰', color: 'var(--green)' },
          { label: 'Status Breakdown', value: JSON.stringify(statusCount), icon: '📊', color: 'var(--blue)' },
        ].map(card => (
          <article key={card.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '22px 24px', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>{card.label}</p>
              <span style={{ fontSize: 20 }}>{card.icon}</span>
            </div>
            <div style={{ color: card.color, fontFamily: 'var(--mono)', fontSize: card.label === 'Status Breakdown' ? 14 : 28, fontWeight: 700, lineHeight: 1.35, wordBreak: 'break-word' }}>
              {card.value}
            </div>
          </article>
        ))}
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
            Recent Orders
            <span style={{ marginLeft: 10, fontSize: 13, color: 'var(--text-muted)', fontWeight: 400 }}>
              {totalOrders} {totalOrders === 1 ? 'order' : 'orders'}
            </span>
          </h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map(header => (
                  <th
                    key={header}
                    style={{
                      textAlign: 'left',
                      padding: '12px 20px',
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending

                return (
                  <tr
                    key={order.id}
                    style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s' }}
                    onMouseEnter={event => { event.currentTarget.style.background = 'var(--surface-2)' }}
                    onMouseLeave={event => { event.currentTarget.style.background = 'transparent' }}
                  >
                    <td style={{ padding: '15px 20px', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>{order.id}</td>
                    <td style={{ padding: '15px 20px', color: 'var(--text-primary)', fontWeight: 500 }}>{order.customer}</td>
                    <td style={{ padding: '15px 20px', color: 'var(--text-secondary)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.product}</td>
                    <td style={{ padding: '15px 20px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--mono)', fontSize: 13 }}>₹{formatCurrency(order.amount)}</td>
                    <td style={{ padding: '15px 20px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: status.bg, color: status.color, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: status.dot }} />
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '15px 20px', color: 'var(--text-muted)', fontSize: 13 }}>{order.date}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}