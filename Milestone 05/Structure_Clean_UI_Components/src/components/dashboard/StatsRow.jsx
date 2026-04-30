import StatCard from "../shared/StatCard";

export default function StatsRow({ totalCount, completedCount, remainingCount, progressPercent }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
      <StatCard label="Total Tasks" value={totalCount} caption="All time" />
      <StatCard label="Completed" value={completedCount} valueColor="#22c55e" caption="Done ✓" />
      <StatCard label="Remaining" value={remainingCount} valueColor="#f59e0b" caption="To do" />
      <StatCard label="Progress" value={`${progressPercent}%`} valueColor="#6366f1" progress={`${progressPercent}%`} />
    </div>
  );
}