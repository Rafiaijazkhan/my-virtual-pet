import { useState } from 'react';
import CatchTreat from './CatchTreat';
import GuessMood from './GuessMood';

export default function MiniGames({ pet, onReward, onWake }) {
  const [game, setGame] = useState(null);

  if (game === 'treats') {
    return <CatchTreat onFinish={onReward} onExit={() => setGame(null)} />;
  }

  if (game === 'mood') {
    return <GuessMood pet={pet} onFinish={onReward} onExit={() => setGame(null)} />;
  }

  const sleeping = pet.sleeping;

  return (
    <div className="games-menu">
      <h2>Mini-Games 🎮</h2>
      <p className="hint">Play to earn coins and XP</p>

      {sleeping && (
        <>
          <div className="speech speech-error">Your pet is sleeping 💤</div>
          <button className="btn" onClick={onWake}>
            ☀️ Wake up {pet.name}
          </button>
        </>
      )}

      <div className="game-option">
        <span className="game-emoji">🍪</span>
        <div>
          <strong>Catch the Treat</strong>
          <small>Best score: {pet.bestTreatScore || 0}</small>
        </div>
        <button className="btn" disabled={sleeping} onClick={() => setGame('treats')}>
          Play
        </button>
      </div>

      <div className="game-option">
        <span className="game-emoji">🎭</span>
        <div>
          <strong>Guess the Mood</strong>
          <small>Pick the right expression</small>
        </div>
        <button className="btn" disabled={sleeping} onClick={() => setGame('mood')}>
          Play
        </button>
      </div>
    </div>
  );
}