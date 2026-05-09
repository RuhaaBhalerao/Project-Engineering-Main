import React, { useEffect, useState, useRef } from 'react'
import api from './api/client'

export default function Dashboard({ token, logout }) {
  const [poll, setPoll] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    // Start polling every 10s
    async function fetchPoll(){
      try {
        const res = await api.get('/poll')
        setPoll(res.data)
      } catch (err) {
        console.error('Poll fetch error', err)
      }
    }
    fetchPoll()
    intervalRef.current = setInterval(fetchPoll, 10000)
    // Listen for global session end and clear polling when it occurs
    function onSessionEnd() {
      clearInterval(intervalRef.current)
      if (logout) logout()
    }
    window.addEventListener('sessionExpired', onSessionEnd)
    return () => {
      clearInterval(intervalRef.current)
      window.removeEventListener('sessionExpired', onSessionEnd)
    }
  }, [token])

  async function vote(optionId){
    try{
      const res = await api.post('/vote', { optionId })
      setPoll(res.data.poll)
    } catch (err) {
      console.error('Vote error', err)
    }
  }

  if (!poll) return <div style={{padding:20}}>Loading poll…</div>

  return (
    <div style={{padding:20}}>
      <button onClick={logout}>Logout</button>
      <h3>{poll.question}</h3>
      <ul>
        {poll.options.map(o => (
          <li key={o.id}>
            {o.label} — {o.votes}
            <button onClick={() => vote(o.id)}>Vote</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
