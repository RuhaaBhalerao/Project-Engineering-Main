import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import MissionCard from './components/MissionCard';

// BUG #5: Unstable Callback - handleDelete defined inline
// BUG #6: Expensive Computation in Render - filter/sort not in useMemo
// BUG #7: Double Fetch on Mount - no AbortController, missing dependencies
// BUG #8: DOM Overload - renders all 200 missions immediately, no client-side slicing (will add pagination fetch)
function App() {
  const [missions, setMissions] = useState([]);
    const [visibleCount, setVisibleCount] = useState(12); // FIX #8: Track visible missions count
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // FIX #7: Double Fetch (FIXED)
  // Now uses AbortController, dependency array [], and cleanup function
  useEffect(() => {
    setLoading(true);
    const controller = new AbortController(); // FIX #7: Create abort controller
    
    axios.get(`/api/missions?page=${pagination.page}&limit=${pagination.limit}`, {
      signal: controller.signal // FIX #7: Pass signal for cancellation
    })
      .then(res => {
        // Handle both old and new response formats
        const data = res.data.data || res.data;
        const paginationData = res.data.pagination || {};
        setMissions(data);
        setPagination(prev => ({
          ...prev,
          ...paginationData
        }));
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'CanceledError') { // Don't show error if cancelled
          setError('Failed to fetch missions');
          setLoading(false);
          console.error(err);
        }
      });
    
    // FIX #7: Cleanup function - abort pending requests
    return () => controller.abort();
  }, []); // FIX #7: Set dependency array to [] for single mount fetch

  // FIX #6: Expensive Computation (FIXED) - wrapped in useMemo
  // Now only recalculates when missions, searchTerm, or sortBy changes
  const sorted = useMemo(() => {
    const filtered = missions.filter(m =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'date') {
        return new Date(b.launchDate) - new Date(a.launchDate);
      }
      return 0;
    });
  }, [missions, searchTerm, sortBy]);

  // FIX #9: Unstable Callback (FIXED)
  // Now wrapped with useCallback for stable function reference
  const handleDelete = useCallback((id) => {
    axios.delete(`/api/missions/${id}`)
      .then(() => {
        setMissions(m => m.filter(mission => mission.id !== id));
      })
      .catch(err => console.error(err));
  }, []);

  // FIX #8: DOM Overload (FIXED)
  // Only render first visibleCount missions, not all
  const visibleMissions = sorted.slice(0, visibleCount);

  if (loading && missions.length === 0) {
    return <div className="p-8 text-center">Loading missions...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🚀 Mission Control</h1>
          <p className="text-slate-300 mb-6">Monitoring {pagination.total} space missions</p>

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
              Page {pagination.page} of {pagination.totalPages} (Total: {pagination.total})
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-900 text-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* Render missions from paginated response */}
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

          {/* FIX #8: Load More button for client-side slicing */}
          {visibleMissions.length < sorted.length && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisibleCount(prev => prev + 12)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Load More Missions ({visibleMissions.length} of {sorted.length})
              </button>
            </div>
          )}
        {/* Pagination Controls */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
            disabled={!pagination.hasPrevPage}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-white">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPagination(p => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
            disabled={!pagination.hasNextPage}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
