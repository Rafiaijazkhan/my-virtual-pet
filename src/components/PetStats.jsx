const BARS = [
  { key: 'hunger', label: 'Hunger', icon: '🍎' },
  { key: 'happiness', label: 'Happiness', icon: '💖' },
  { key: 'energy', label: 'Energy', icon: '⚡' },
  { key: 'cleanliness', label: 'Clean', icon: '🫧' },
  { key: 'health', label: 'Health', icon: '❤️' },
];

function barColor(value) {
  if (value < 30) return '#ff7a8a';
  if (value < 60) return '#ffcf70';
  return '#6fdba5';
}

export default function PetStats({ stats }) {
  return (
    <div className="stats-card">
      {BARS.map((b) => {
        const value = Math.round(stats[b.key]);
        return (
          <div className="stat-row" key={b.key}>
            <span className="stat-label">
              {b.icon} {b.label}
            </span>
            <div className="bar">
              <div
                className="bar-fill"
                style={{ width: `${value}%`, background: barColor(value) }}
              />
            </div>
            <span className="stat-value">{value}</span>
          </div>
        );
      })}
    </div>
  );
}