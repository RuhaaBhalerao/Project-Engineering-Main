import React from 'react';

// BUG #3: ScoreCard is not memoized even though handleDelete is unstable
// This causes unnecessary re-renders whenever App re-renders
// Should be: export default React.memo(ScoreCard);
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

      <p className="text-gray-300 text-sm">{score.strategyNote?.substring(0, 100) || 'Classic arcade'}...</p>
    </div>
  );
}

export default ScoreCard;
