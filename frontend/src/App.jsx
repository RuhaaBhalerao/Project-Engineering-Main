import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScoreCard from './components/ScoreCard';

// BUG #1: DOUBLE FETCH - Missing AbortController, no cleanup, missing dependency array
// BUG #2: EXPENSIVE COMPUTATION - Filter logic runs in render (not in useMemo)
// BUG #3: UNSTABLE CALLBACK - handleDelete defined inline, no useCallback
function App() {
  const [scores, setScores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // BUG #1: DOUBLE FETCH ON MOUNT
  // Missing dependency array causes this to run on every render
  // No AbortController to prevent memory leaks
  useEffect(() => {
    setLoading(true);
    // No AbortController!
    fetch('/api/scores')
      .then(res => res.json())
      .then(data => {
        setScores(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
    // BUG #1: Missing dependency array [] causes double fetch in React Strict Mode
  }); // ← NO DEPENDENCY ARRAY!

  // BUG #2: EXPENSIVE COMPUTATION IN RENDER
  // This filter logic runs on EVERY render, blocking the main thread during search
  // Should be wrapped in useMemo with [scores, searchTerm] dependencies
  const filteredScores = scores.filter(score =>
    score.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
    score.player.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // BUG #3: UNSTABLE CALLBACK
  // handleDelete is defined inline without useCallback
  // This breaks memoization of ScoreCard components
  const handleDelete = (id) => {
    axios.delete(`/api/scores/${id}`)
      .then(() => {
        setScores(scores.filter(s => s.id !== id));
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">🕹️ Retro Game High Score Wall</h1>
        <p className="text-gray-400 mb-8">Classic arcade champions and their legendary scores</p>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by game or player..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {loading && <p className="text-center text-gray-400">Loading scores...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScores.map((score) => (
              <ScoreCard
                key={score.id}
                score={score}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {!loading && filteredScores.length === 0 && (
          <p className="text-center text-gray-400">No scores found</p>
        )}
      </div>
    </div>
  );
}

export default App;
