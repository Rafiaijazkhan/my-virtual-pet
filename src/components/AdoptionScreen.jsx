import { useState } from 'react';
import { PETS } from '../data/pets';

export default function AdoptionScreen({ onAdopt }) {
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [celebrating, setCelebrating] = useState(false);

  const confirm = () => {
    if (!name.trim()) {
      setError('Please give your pet a name 💕');
      return;
    }
    setCelebrating(true);
    setTimeout(() => onAdopt(selected.id, name), 1800);
  };

  if (celebrating) {
    return (
      <div className="adopt-screen">
        <div className="celebrate">
          <div className="pet-big bounce">{selected.emoji}</div>
          <h1>Welcome, {name.trim()}! 🎉</h1>
          <p>Taking you to your new home...</p>
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="adopt-screen">
        <div className="name-card">
          <div className="pet-big bounce">{selected.emoji}</div>
          <h2>Name your {selected.name}</h2>
          <input
            type="text"
            maxLength={12}
            value={name}
            placeholder="Type a name..."
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && confirm()}
            autoFocus
          />
          {error && <p className="error-text">{error}</p>}
          <div className="row">
            <button className="btn btn-soft" onClick={() => setSelected(null)}>
              Back
            </button>
            <button className="btn" onClick={confirm}>
              Adopt 💖
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="adopt-screen">
      <h1 className="title">Petopia 🐾</h1>
      <p className="subtitle">Choose your new little friend</p>
      <div className="pet-grid">
        {PETS.map((pet) => (
          <div className="pet-card" key={pet.id}>
            <div className="pet-big float">{pet.emoji}</div>
            <h3>{pet.name}</h3>
            <p>{pet.desc}</p>
            <button className="btn" onClick={() => setSelected(pet)}>
              Adopt
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}