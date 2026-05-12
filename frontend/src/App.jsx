import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import ScoreCard from './components/ScoreCard';

// Performance Optimization:
// FIX #4: AbortController + dependency array in useEffect
function App() {
  const [scores, setScores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // FIX #4: DOUBLE FETCH FIX
  // Add AbortController for cleanup and dependency array to prevent double fetch
  useEffect(() => {
    const controller = new AbortController();
    
    setLoading(true);
    fetch('/api/scores?page=1&limit=20', { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        // Backend now returns { scores, total, totalPages, ... }
        setScores(data.scores || data);
        setLoading(false);
      })
      .catch(err => {
        // Don't show error if request was aborted
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });
    
    // Cleanup: abort request if component unmounts
    return () => controller.abort();
  }, []); // ← FIX: Added dependency array to run only once on mount

  // FIX #5: EXPENSIVE COMPUTATION FIX
  // Wrap filter logic in useMemo with dependencies to prevent re-calculation on every render
  const filteredScores = useMemo(() => {
    return scores.filter(score =>
      score.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
      score.player.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [scores, searchTerm]); // ← FIX: Wrapped in useMemo with deps

  // FIX #6: UNSTABLE CALLBACK FIX
  // Wrap in useCallback to provide stable callback reference for memoized ScoreCard
  const handleDelete = useCallback((id) => {
    axios.delete(`/api/scores/${id}`)
      .then(() => {
        setScores(scores.filter(s => s.id !== id));
      });
  }, [scores]); // ← FIX: Wrapped in useCallback with deps

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
