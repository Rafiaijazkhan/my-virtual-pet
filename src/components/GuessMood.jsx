import { useState } from 'react';
import { PETS } from '../data/pets';

const MOODS = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
  { id: 'sleepy', label: 'Sleepy', emoji: '😴' },
  { id: 'hungry', label: 'Hungry', emoji: '🤤' },
  { id: 'excited', label: 'Excited', emoji: '🤩' },
  { id: 'grumpy', label: 'Grumpy', emoji: '😠' },
];

const ROUNDS = 5;
const COINS_PER_ANSWER = 4;

const shuffle = (list) => [...list].sort(() => Math.random() - 0.5);

function makeRounds() {
  return shuffle(MOODS)
    .slice(0, ROUNDS)
    .map((mood) => {
      const wrong = shuffle(MOODS.filter((m) => m.id !== mood.id)).slice(0, 3);
      return { mood, options: shuffle([mood, ...wrong]) };
    });
}

export default function GuessMood({ pet, onFinish, onExit }) {
  const [phase, setPhase] = useState('intro');
  const [rounds, setRounds] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [result, setResult] = useState(null);

  const info = PETS.find((p) => p.id === pet.type);

  const start = () => {
    setRounds(makeRounds());
    setIndex(0);
    setScore(0);
    setPicked(null);
    setResult(null);
    setPhase('playing');
  };

  const choose = (option) => {
    if (picked) return;
    const round = rounds[index];
    const correct = option.id === round.mood.id;
    const newScore = correct ? score + 1 : score;
    setPicked({ id: option.id, correct });
    if (correct) setScore(newScore);

    setTimeout(() => {
      if (index + 1 >= ROUNDS) {
        const coins = newScore * COINS_PER_ANSWER;
        const xp = 5 + newScore * 2;
        setResult({ coins, xp, score: newScore });
        setPhase('done');
        onFinish({ game: 'mood', coins, xp, score: newScore });
      } else {
        setIndex(index + 1);
        setPicked(null);
      }
    }, 1000);
  };

  if (phase === 'intro') {
    return (
      <div className="game-card">
        <h2>Guess the Mood 🎭</h2>
        <p>
          Look at the face and pick the right mood. {ROUNDS} rounds, 🪙 {COINS_PER_ANSWER} coins for
          each correct answer!
        </p>
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
        <div className="pet-big bounce">{result.score >= 4 ? '🎉' : '👍'}</div>
        <h2>
          {result.score} / {ROUNDS} correct!
        </h2>
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

  const round = rounds[index];

  return (
    <div className="game-card">
      <div className="game-top">
        <strong>
          Round {index + 1} / {ROUNDS}
        </strong>
        <strong>✅ {score}</strong>
      </div>

      <div className="mood-face">
        <span className="mood-pet">{info ? info.emoji : '🐾'}</span>
        <span className="mood-big">{round.mood.emoji}</span>
      </div>

      <p>
        <strong>How is {pet.name} feeling?</strong>
      </p>

      <div className="mood-options">
        {round.options.map((o) => {
          let cls = 'mood-option';
          if (picked) {
            if (o.id === round.mood.id) cls += ' right';
            else if (o.id === picked.id) cls += ' wrong';
          }
          return (
            <button key={o.id} className={cls} disabled={Boolean(picked)} onClick={() => choose(o)}>
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}