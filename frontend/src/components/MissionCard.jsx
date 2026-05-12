import React from 'react';

// FIX #5: Move style to module level (stable reference)
const cardStyle = { marginBottom: '8px' };

// FIX #5: Unstable Prop Trap (FIXED) + React.memo
// Now stable because cardStyle is module-level and onDelete should be memoized
const MissionCard = ({ mission, onDelete }) => {

  return (
    <div style={cardStyle} className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{mission.name}</h3>
          <p className="text-slate-400 text-sm">
            Launch: {new Date(mission.launchDate).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          mission.status === 'COMPLETED' ? 'bg-green-500 text-white' :
          mission.status === 'LAUNCHED' ? 'bg-blue-500 text-white' :
          mission.status === 'IN_ORBIT' ? 'bg-purple-500 text-white' :
          'bg-gray-500 text-white'
        }`}>
          {mission.status}
        </span>
      </div>

      <p className="text-slate-300 mb-4">
        <span className="font-semibold">Rocket:</span> {mission.rocket}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-800 p-3 rounded">
          <p className="text-slate-500 text-xs">Crew Members</p>
          <p className="text-white text-lg font-bold">{mission.crew?.length || 0}</p>
        </div>
        <div className="bg-slate-800 p-3 rounded">
          <p className="text-slate-500 text-xs">Event Logs</p>
          <p className="text-white text-lg font-bold">{mission.logs?.length || 0}</p>
        </div>
      </div>

      {mission.crew && mission.crew.length > 0 && (
        <div className="mb-4">
          <p className="text-slate-400 text-sm font-semibold mb-2">Crew:</p>
          <div className="flex flex-wrap gap-2">
            {mission.crew.map((member) => (
              <span key={member.id} className="bg-slate-600 text-slate-200 text-xs px-2 py-1 rounded">
                {member.name} ({member.role})
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => onDelete(mission.id)}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
      >
        Delete Mission
      </button>
    </div>
  );
};

export default MissionCard;

export default React.memo(MissionCard);
