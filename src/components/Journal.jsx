export default function Journal({ pet }) {
  const date = new Date(pet.adoptedAt).toLocaleDateString();
  const days = Math.floor((Date.now() - pet.adoptedAt) / 86400000);
  const c = pet.counters;
  const total = c.fed + c.baths + c.sleeps + c.pets + c.games + c.purchases;

  return (
    <div className="journal">
      <h2>{pet.name}'s Journal 📖</h2>

      <div className="note note-pink">
        <strong>📅 Adopted on {date}</strong>
        <span>{days === 0 ? 'Today!' : `${days} day(s) together`}</span>
      </div>

      <div className="note note-blue">
        <strong>📊 Activities: {total}</strong>
        <span>🍎 Fed: {c.fed} · 🎮 Games: {c.games}</span>
        <span>🛁 Baths: {c.baths} · 🛍️ Items bought: {c.purchases}</span>
      </div>

      <div className="note note-mint">
        <strong>🏆 Milestones</strong>
        {pet.milestones.length === 0 && <span>None yet. Keep playing!</span>}
        {pet.milestones.map((m) => (
          <span key={m.id}>{m.text}</span>
        ))}
      </div>

      <div className="note note-lavender">
        <strong>🕐 Recent</strong>
        {pet.history.slice(0, 8).map((h, i) => (
          <span key={i}>
            {h.text} <small>({new Date(h.time).toLocaleTimeString()})</small>
          </span>
        ))}
      </div>
    </div>
  );
}