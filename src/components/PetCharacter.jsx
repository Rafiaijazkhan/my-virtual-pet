import { PETS } from '../data/pets';
import { SHOP_ITEMS } from '../data/items';

const MOOD_FACE = {
  sleeping: '😴',
  hungry: '🍽️',
  sleepy: '🥱',
  dirty: '🫧',
  sad: '😢',
  excited: '✨',
  happy: '💖',
};

export default function PetCharacter({ pet, mood, action }) {
  const info = PETS.find((p) => p.id === pet.type);
  const worn = (category) => SHOP_ITEMS.find((i) => i.id === pet.equipped[category]);
  const hat = worn('hats');
  const bow = worn('bows');
  const glasses = worn('glasses');
  const collar = worn('collars');

  return (
    <div className={`pet-stage ${pet.sleeping ? 'night' : ''}`}>
      <div className={`pet-body mood-${mood} ${action || ''}`}>
        {hat && <span className="acc acc-hat">{hat.emoji}</span>}
        {bow && <span className="acc acc-bow">{bow.emoji}</span>}
        <span className="pet-face">{info ? info.emoji : '🐾'}</span>
        {glasses && <span className="acc acc-glasses">{glasses.emoji}</span>}
        {collar && <span className="acc acc-collar">{collar.emoji}</span>}
        <span className="mood-badge">{MOOD_FACE[mood]}</span>
      </div>
      <div className="pet-shadow" />
    </div>
  );
}