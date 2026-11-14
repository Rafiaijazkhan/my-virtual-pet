export default function ActionButtons({ sleeping, onFeed, onBath, onSleep, onPet }) {
  return (
    <div className="actions">
      <button className="action-btn" onClick={onFeed}>
        <span>🍎</span>Feed
      </button>
      <button className="action-btn" onClick={onBath}>
        <span>🛁</span>Bath
      </button>
      <button className="action-btn" onClick={onSleep}>
        <span>{sleeping ? '☀️' : '🌙'}</span>
        {sleeping ? 'Wake up' : 'Sleep'}
      </button>
      <button className="action-btn" onClick={onPet}>
        <span>🤚</span>Pet
      </button>
    </div>
  );
}