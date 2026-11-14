import { useState, useEffect } from 'react';
import { usePetGame } from './utils/usePetGame';
import { getMood, MOOD_TEXT } from './utils/gameLogic';
import AdoptionScreen from './components/AdoptionScreen';
import PetCharacter from './components/PetCharacter';
import PetStats from './components/PetStats';
import ActionButtons from './components/ActionButtons';
import FoodSelector from './components/FoodSelector';

const ANIM = {
  eat: 'anim-eat',
  bath: 'anim-bath',
  love: 'anim-love',
  happy: 'anim-happy',
};

function App() {
  const game = usePetGame();
  const [showFood, setShowFood] = useState(false);
  const [bubble, setBubble] = useState(null);
  const [anim, setAnim] = useState('');

  useEffect(() => {
    if (!game.reaction) return;
    setBubble(game.reaction);
    setAnim(ANIM[game.reaction.kind] || '');
    const t1 = setTimeout(() => setBubble(null), 3500);
    const t2 = setTimeout(() => setAnim(''), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [game.reaction]);

  if (!game.pet) {
    return <AdoptionScreen onAdopt={game.adopt} />;
  }

  const mood = getMood(game.pet);
  const speechText = bubble ? bubble.text : MOOD_TEXT[mood];

  return (
    <div className="temp-home">
      <div className="top-bar">
        <strong>
          {game.pet.name} · Lv {game.pet.level}
        </strong>
        <strong>🪙 {game.pet.coins}</strong>
      </div>

      <div className={`speech ${bubble && bubble.kind === 'error' ? 'speech-error' : ''}`}>
        {speechText}
      </div>

      <div className="stage-wrap">
        <PetCharacter pet={game.pet} mood={mood} action={anim} />
        {anim === 'anim-love' && (
          <div className="hearts">
            <span>💖</span>
            <span>💕</span>
            <span>💗</span>
          </div>
        )}
      </div>

      <PetStats stats={game.pet.stats} />

      <ActionButtons
        sleeping={game.pet.sleeping}
        onFeed={() => setShowFood(true)}
        onBath={game.bath}
        onSleep={game.toggleSleep}
        onPet={game.petPet}
      />

      {showFood && (
        <FoodSelector
          coins={game.pet.coins}
          onPick={game.feed}
          onClose={() => setShowFood(false)}
        />
      )}

      <button className="btn btn-soft" onClick={game.release}>
        Release pet (for testing)
      </button>
    </div>
  );
}

export default App;