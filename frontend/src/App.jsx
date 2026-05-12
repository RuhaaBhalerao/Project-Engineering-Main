import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MissionCard from './components/MissionCard';

// BUG #5: Unstable Callback - handleDelete defined inline
// BUG #6: Expensive Computation in Render - filter/sort not in useMemo
// BUG #7: Double Fetch on Mount - no AbortController, missing dependencies
// BUG #8: DOM Overload - renders all 200 missions immediately, no client-side slicing
function App() {
  const [missions, setMissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // BUG #7: Double Fetch on Mount
  // Missing dependency array and no AbortController cleanup
  // This causes two identical requests in React Strict Mode
  useEffect(() => {
    setLoading(true);
    axios.get('/api/missions')
      .then(res => {
        setMissions(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch missions');
        setLoading(false);
        console.error(err);
      });
    // NOTE: Missing dependency array [] - triggers on every render
    // NOTE: No AbortController to clean up previous requests
  });

  // BUG #6: Expensive Computation in Render
  // Filter and sort logic runs directly in component body
  // Blocks main thread on every keystroke
  const filtered = missions.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = filtered.sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'date') {
      return new Date(b.launchDate) - new Date(a.launchDate);
    }
    return 0;
  });

  // BUG #5: Unstable Callback
  // handleDelete is defined inline without useCallback
  // Creates new function reference on every render, breaks memoization
  const handleDelete = (id) => {
    axios.delete(`/api/missions/${id}`)
      .then(() => {
        setMissions(m => m.filter(mission => mission.id !== id));
      })
      .catch(err => console.error(err));
  };

  // BUG #8: DOM Overload
  // Renders all 200 mission cards immediately
  // No pagination or client-side slicing
  const visibleMissions = sorted; // All missions rendered

  if (loading && missions.length === 0) {
    return <div className="p-8 text-center">Loading missions...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🚀 Mission Control</h1>
          <p className="text-slate-300 mb-6">Monitoring {missions.length} space missions</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Search missions by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
            </select>

            <div className="text-slate-300 text-sm py-2">
              Showing {visibleMissions.length} of {missions.length} missions
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-900 text-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* BUG #8: All 200 missions rendered at once */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {visibleMissions.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No missions found. Try adjusting your search.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
