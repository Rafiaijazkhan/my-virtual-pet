import { FOODS } from '../data/items';

export default function FoodSelector({ coins, onPick, onClose }) {
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Choose a snack 🍽️</h2>
        <p className="coins-line">You have 🪙 {coins}</p>
        <div className="food-grid">
          {FOODS.map((f) => (
            <button
              key={f.id}
              className="food-card"
              disabled={coins < f.price}
              onClick={() => {
                onPick(f.id);
                onClose();
              }}
            >
              <span className="food-emoji">{f.emoji}</span>
              <strong>{f.name}</strong>
              <small>{f.price === 0 ? 'Free' : `🪙 ${f.price}`}</small>
              <small>
                🍎 +{f.hunger}
                {f.happiness > 0 ? `  💖 +${f.happiness}` : ''}
              </small>
            </button>
          ))}
        </div>
        <button className="btn btn-soft" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}