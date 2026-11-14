import { useState, useEffect } from 'react';

const TREATS = ['🍪', '🍩', '🧁', '🍓', '🍬', '🍭'];
const GAME_SECONDS = 20;

export default function CatchTreat({ onFinish, onExit }) {
  const [phase, setPhase] = useState('intro');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [treats, setTreats] = useState([]);
  const [result, setResult] = useState(null);

  const start = () => {
    setScore(0);
    setTimeLeft(GAME_SECONDS);
    setTreats([]);
    setResult(null);
    setPhase('playing');
  };

  // Drops treats and counts the seconds
  useEffect(() => {
    if (phase !== 'playing') return;
    const spawn = setInterval(() => {
      setTreats((list) => [
        ...list,
        {
          id: Date.now() + Math.random(),
          left: 5 + Math.random() * 80,
          emoji: TREATS[Math.floor(Math.random() * TREATS.length)],
        },
      ]);
    }, 650);
    const tick = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => {
      clearInterval(spawn);
      clearInterval(tick);
    };
  }, [phase]);

  // Ends the game when time is up
  useEffect(() => {
    if (phase === 'playing' && timeLeft <= 0) {
      const coins = Math.min(40, score * 2);
      const xp = 5 + score;
      setPhase('done');
      setTreats([]);
      setResult({ coins, xp });
      onFinish({ game: 'treats', coins, xp, score });
    }
  }, [timeLeft, phase, score, onFinish]);

  const removeTreat = (id) => setTreats((list) => list.filter((t) => t.id !== id));

  const catchTreat = (id) => {
    removeTreat(id);
    setScore((s) => s + 1);
  };

  if (phase === 'intro') {
    return (
      <div className="game-card">
        <h2>Catch the Treat 🍪</h2>
        <p>Tap the falling treats before they hit the ground. You have {GAME_SECONDS} seconds!</p>
        <div className="row">
          <button className="btn btn-soft" onClick={onExit}>
            Back
          </button>
          <button className="btn" onClick={start}>
            Start
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="game-card">
        <div className="pet-big bounce">🎉</div>
        <h2>Time's up!</h2>
        <p>
          You caught <strong>{score}</strong> treats.
        </p>
        <p>
          You won 🪙 {result.coins} coins and ⭐ {result.xp} XP!
        </p>
        <div className="row">
          <button className="btn btn-soft" onClick={onExit}>
            Back
          </button>
          <button className="btn" onClick={start}>
            Play again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-card">
      <div className="game-top">
        <strong>🍪 {score}</strong>
        <strong>⏱️ {Math.max(0, timeLeft)}s</strong>
      </div>
      <div className="arena">
        {treats.map((t) => (
          <span
            key={t.id}
            className="treat"
            style={{ left: `${t.left}%` }}
            onPointerDown={() => catchTreat(t.id)}
            onAnimationEnd={() => removeTreat(t.id)}
          >
            {t.emoji}
          </span>
        ))}
      </div>
    </div>
  );
}