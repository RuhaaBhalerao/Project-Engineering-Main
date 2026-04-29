//  YOUR FOUR TASKS
//
//  LOADING STATE (while data is being fetched)
//
//  SUCCESS STATE (data loaded, orders present)
//
//  EMPTY STATE (data loaded, but zero orders returned)
//
//  ERROR STATE (the API call failed)
//
//   HOW TO TEST EACH STATE
//
//  Open src/mockApi.js and change the SIMULATE constant:
//    'loading'  → tests your loading state (hangs forever)
//    'success'  → tests your success state (8 orders returned)
//    'empty'    → tests your empty state   (0 orders returned)
//    'error'    → tests your error state   (API throws error)

import { useEffect, useState } from 'react'
import { fetchOrders } from '../mockApi'
import Loading from './orders/Loading'
import ErrorState from './orders/Error'
import EmptyState from './orders/Empty'
import Success from './orders/Success'

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadOrders = () => {
    setLoading(true)
    setError(null)
    setOrders([])

    fetchOrders()
      .then(data => {
        setOrders(data)
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadOrders()
  }, [])

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>

      {/* ── PAGE HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 38, height: 38, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📦</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>Orders</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Manage and track all customer orders in one place.</p>
        </div>
        <button onClick={loadOrders} disabled={loading} style={{
          padding: '10px 20px', background: 'var(--accent)', color: '#000',
          border: 'none', borderRadius: 'var(--radius)', fontSize: 14,
          fontWeight: 600, cursor: loading ? 'progress' : 'pointer', opacity: loading ? 0.75 : 1,
        }}>
          ↻ Refresh
        </button>
      </div>

      {loading && <Loading />}
      {!loading && error && <ErrorState message={error} onRetry={loadOrders} />}
      {!loading && !error && orders.length === 0 && <EmptyState isFiltered={false} />}
      {!loading && !error && orders.length > 0 && <Success orders={orders} />}
    </div>
  )
}
