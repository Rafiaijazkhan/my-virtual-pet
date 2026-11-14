import { useState, useEffect } from 'react';
import { usePetGame } from './utils/usePetGame';
import { getMood, MOOD_TEXT } from './utils/gameLogic';
import AdoptionScreen from './components/AdoptionScreen';
import PetCharacter from './components/PetCharacter';
import PetStats from './components/PetStats';
import ActionButtons from './components/ActionButtons';
import FoodSelector from './components/FoodSelector';
import Navigation from './components/Navigation';
import LevelProgress from './components/LevelProgress';
import MiniGames from './components/MiniGames';
import Shop from './components/Shop';
import Journal from './components/Journal';

const ANIM = {
  eat: 'anim-eat',
  bath: 'anim-bath',
  love: 'anim-love',
  happy: 'anim-happy',
};

function App() {
  const game = usePetGame();
  const [view, setView] = useState('home');
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

  const pet = game.pet;
  const mood = getMood(pet);
  const speechText = bubble ? bubble.text : MOOD_TEXT[mood];
  const showPet = view === 'home' || view === 'activities';

  return (
    <div className="temp-home">
      <div className="top-bar">
        <strong>
          {pet.name} · Lv {pet.level}
        </strong>
        <strong>🪙 {pet.coins}</strong>
      </div>

      {showPet && (
        <>
          <div className={`speech ${bubble && bubble.kind === 'error' ? 'speech-error' : ''}`}>
            {speechText}
          </div>

          <div
            className={`stage-wrap ${view === 'home' ? 'tappable' : ''}`}
            onClick={view === 'home' ? game.petPet : undefined}
          >
            <PetCharacter pet={pet} mood={mood} action={anim} />
            {anim === 'anim-love' && (
              <div className="hearts">
                <span>💖</span>
                <span>💕</span>
                <span>💗</span>
              </div>
            )}
          </div>
        </>
      )}

      {view === 'home' && (
        <>
          <p className="hint">Tap your pet to cuddle it 💕</p>
          <LevelProgress level={pet.level} xp={pet.xp} />
          <PetStats stats={pet.stats} />
          <button className="btn btn-soft" onClick={game.release}>
            Release pet (for testing)
          </button>
        </>
      )}

      {view === 'activities' && (
        <>
          <ActionButtons
            sleeping={pet.sleeping}
            onFeed={() => setShowFood(true)}
            onBath={game.bath}
            onSleep={game.toggleSleep}
            onPet={game.petPet}
          />
          <div className="care-card">
            <strong>Your care so far</strong>
            <span>🍎 Fed: {pet.counters.fed} times</span>
            <span>🛁 Baths: {pet.counters.baths}</span>
            <span>🌙 Sleeps: {pet.counters.sleeps}</span>
            <span>🤚 Cuddles: {pet.counters.pets}</span>
          </div>
        </>
      )}

            {view === 'games' && (
        <MiniGames pet={pet} onReward={game.rewardGame} onWake={game.toggleSleep} />
      )}
      {view === 'shop' && <Shop pet={pet} onBuy={game.buy} onEquip={game.equip} />}
      {view === 'journal' && <Journal pet={pet} />}

      {!showPet && bubble && (
        <div className={`toast ${bubble.kind === 'error' ? 'toast-error' : ''}`}>
          {bubble.text}
        </div>
      )}

      {showFood && (
        <FoodSelector
          coins={pet.coins}
          onPick={game.feed}
          onClose={() => setShowFood(false)}
        />
      )}

      {game.levelUpTo && (
        <div className="modal-back" onClick={game.dismissLevelUp}>
          <div className="modal levelup" onClick={(e) => e.stopPropagation()}>
            <div className="pet-big bounce">🎉</div>
            <h2>Level up!</h2>
            <p>
              {pet.name} reached level {game.levelUpTo}! You got 🪙 20 bonus coins.
            </p>
            <button className="btn" onClick={game.dismissLevelUp}>
              Yay!
            </button>
          </div>
        </div>
      )}

      <Navigation view={view} onChange={setView} />
    </div>
  );
}

export default App;