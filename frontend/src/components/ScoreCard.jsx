import React from 'react';

// FIX #6: Memoize ScoreCard to prevent unnecessary re-renders
// Only re-renders when score or onDelete props actually change
function ScoreCard({ score, onDelete }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-yellow-400">{score.game}</h3>
          <p className="text-gray-400">{score.player}</p>
        </div>
        <button
          onClick={() => onDelete(score.id)}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
        >
          Delete
        </button>
      </div>

      <div className="mb-4">
        <p className="text-3xl font-bold text-green-400">
          {score.score.toLocaleString()}
        </p>
        <p className="text-gray-400 text-sm">
          {new Date(score.date).toLocaleDateString()}
        </p>
      </div>

      {/* strategyNote removed from API response for performance (Fix #2) */}
      <p className="text-gray-300 text-sm">Arcade champion entry</p>
    </div>
  );
}

// FIX #6: Wrap in React.memo to prevent re-renders when props don't change
export default React.memo(ScoreCard);
