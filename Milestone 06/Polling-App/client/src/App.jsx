import React, { useState } from 'react'
import api from './api/client'
import Dashboard from './Dashboard'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'))

  async function login(e) {
    e.preventDefault()
    const email = e.target.email.value
    const res = await api.post('/login', { email })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setToken(res.data.token)
    setUser(res.data.user)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  if (!token) {
    return (
      <div style={{padding:20}}>
        <h2>Login</h2>
        <form onSubmit={login}>
          <input name="email" placeholder="email" />
          <button type="submit">Login</button>
        </form>
      </div>
    )
  }

  return <Dashboard token={token} logout={logout} />
}
