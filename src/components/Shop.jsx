import { useState } from 'react';
import { SHOP_ITEMS, CATEGORIES } from '../data/items';

export default function Shop({ pet, onBuy, onEquip }) {
  const [category, setCategory] = useState('hats');
  const items = SHOP_ITEMS.filter((i) => i.category === category);

  return (
    <div className="shop">
      <h2>Shop 🛍️</h2>
      <p className="coins-line">You have 🪙 {pet.coins}</p>

      <div className="shop-tabs">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`shop-tab ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="shop-grid">
        {items.map((item) => {
          const owned = pet.inventory.includes(item.id);
          const locked = pet.level < item.level;
          const worn = pet.equipped[item.category] === item.id;
          return (
            <div className={`shop-item ${locked ? 'locked' : ''}`} key={item.id}>
              <span className="food-emoji">{locked ? '🔒' : item.emoji}</span>
              <strong>{item.name}</strong>
              {owned ? (
                <button className="btn btn-small" onClick={() => onEquip(item.id)}>
                  {worn ? 'Take off' : 'Wear'}
                </button>
              ) : locked ? (
                <small>Unlocks at level {item.level}</small>
              ) : (
                <button
                  className="btn btn-small"
                  disabled={pet.coins < item.price}
                  onClick={() => onBuy(item.id)}
                >
                  🪙 {item.price}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}