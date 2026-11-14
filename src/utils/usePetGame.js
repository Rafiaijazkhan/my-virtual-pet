import { useState, useEffect } from 'react';
import { loadGame, saveGame, clearGame } from './storage';
import { applyDecay, createPet, clamp, calcHealth, xpForLevel } from './gameLogic';
import { FOODS, SHOP_ITEMS } from '../data/items';

const MILESTONES = [
  { id: 'first-meal', text: 'First meal together 🍽️', test: (p) => p.counters.fed >= 1 },
  { id: 'fed-10', text: 'Fed 10 times 🥕', test: (p) => p.counters.fed >= 10 },
  { id: 'first-game', text: 'Played the first game 🎮', test: (p) => p.counters.games >= 1 },
  { id: 'first-bath', text: 'First bubble bath 🛁', test: (p) => p.counters.baths >= 1 },
  { id: 'first-buy', text: 'Bought the first item 🛍️', test: (p) => p.counters.purchases >= 1 },
  { id: 'level-3', text: 'Reached level 3 ⭐', test: (p) => p.level >= 3 },
  { id: 'level-5', text: 'Reached level 5 🌟', test: (p) => p.level >= 5 },
];

function addHistory(pet, text) {
  return { ...pet, history: [{ text, time: Date.now() }, ...pet.history].slice(0, 50) };
}

function gainXp(pet, amount) {
  let xp = pet.xp + amount;
  let level = pet.level;
  let coins = pet.coins;
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level += 1;
    coins += 20;
  }
  let next = { ...pet, xp, level, coins };
  if (level > pet.level) next = addHistory(next, `Level up! Now level ${level} 🎉`);
  return next;
}

function finalize(pet) {
  const stats = {};
  Object.keys(pet.stats).forEach((k) => (stats[k] = clamp(pet.stats[k])));
  stats.health = calcHealth(stats);
  let next = { ...pet, stats, coins: Math.max(0, Math.round(pet.coins)) };
  MILESTONES.forEach((m) => {
    if (!next.milestones.some((x) => x.id === m.id) && m.test(next)) {
      next = {
        ...next,
        milestones: [...next.milestones, { id: m.id, text: m.text, time: Date.now() }],
      };
    }
  });
  return next;
}

export function usePetGame() {
  const [pet, setPet] = useState(() => {
    const saved = loadGame();
    return saved ? applyDecay(saved) : null;
  });
  const [reaction, setReaction] = useState(null);
  const [levelUpTo, setLevelUpTo] = useState(null);
  const adopted = pet !== null;

  // Update stats every 10 seconds
  useEffect(() => {
    if (!adopted) return;
    const id = setInterval(() => {
      setPet((p) => (p ? applyDecay(p) : p));
    }, 10000);
    return () => clearInterval(id);
  }, [adopted]);

  // Save every time the pet changes
  useEffect(() => {
    if (pet) saveGame(pet);
  }, [pet]);

  const say = (text, kind = 'info') => setReaction({ text, kind, id: Date.now() });

  // Runs an action on the freshly updated pet
  const act = (fn) => {
    if (!pet) return;
    const current = applyDecay(pet);
    const result = fn(current);
    if (result.error) {
      setPet(current);
      say(result.error, 'error');
      return;
    }
    const next = finalize(result.pet);
    setPet(next);
    if (next.level > pet.level) setLevelUpTo(next.level);
    if (result.say) say(result.say, result.kind || 'happy');
  };

  const adopt = (type, rawName) => {
    const name = rawName.trim().slice(0, 12);
    if (!name) return false;
    const fresh = finalize(addHistory(createPet(type, name), `Adopted ${name} 💖`));
    setPet(fresh);
    return true;
  };

  const feed = (foodId) =>
    act((p) => {
      const food = FOODS.find((f) => f.id === foodId);
      if (!food) return { error: 'That food does not exist.' };
      if (p.sleeping) return { error: 'Shh... your pet is sleeping 💤' };
      if (p.coins < food.price) return { error: 'Not enough coins 🪙' };
      if (p.stats.hunger >= 98) return { error: "I'm full! 🍽️" };
      let next = {
        ...p,
        coins: p.coins - food.price,
        stats: {
          ...p.stats,
          hunger: p.stats.hunger + food.hunger,
          happiness: p.stats.happiness + food.happiness,
        },
        counters: { ...p.counters, fed: p.counters.fed + 1 },
      };
      next = addHistory(next, `Ate ${food.name} ${food.emoji}`);
      next = gainXp(next, food.xp);
      return { pet: next, say: 'Yum! So tasty! 😋', kind: 'eat' };
    });

  const bath = () =>
    act((p) => {
      if (p.sleeping) return { error: 'Shh... your pet is sleeping 💤' };
      if (p.stats.cleanliness >= 95) return { error: "I'm already clean! ✨" };
      let next = {
        ...p,
        stats: {
          ...p.stats,
          cleanliness: p.stats.cleanliness + 50,
          energy: p.stats.energy - 5,
          happiness: p.stats.happiness + 5,
        },
        counters: { ...p.counters, baths: p.counters.baths + 1 },
      };
      next = addHistory(next, 'Took a bubble bath 🛁');
      next = gainXp(next, 6);
      return { pet: next, say: 'So fresh and clean! 🫧', kind: 'bath' };
    });

  const toggleSleep = () =>
    act((p) => {
      if (p.sleeping) {
        const next = addHistory({ ...p, sleeping: false }, 'Woke up ☀️');
        return { pet: next, say: 'Good morning! ☀️', kind: 'happy' };
      }
      if (p.stats.energy >= 90) return { error: "I'm not sleepy yet 😄" };
      let next = {
        ...p,
        sleeping: true,
        counters: { ...p.counters, sleeps: p.counters.sleeps + 1 },
      };
      next = addHistory(next, 'Went to sleep 🌙');
      return { pet: next, say: 'Zzz... 💤', kind: 'sleep' };
    });

  const petPet = () =>
    act((p) => {
      if (p.sleeping) return { error: 'Shh... your pet is sleeping 💤' };
      let next = {
        ...p,
        stats: { ...p.stats, happiness: p.stats.happiness + 5 },
        counters: { ...p.counters, pets: p.counters.pets + 1 },
      };
      next = gainXp(next, 1);
      if (next.counters.pets % 10 === 0) next = addHistory(next, 'Got lots of cuddles 💕');
      return { pet: next, say: 'Aww, I love that! 💕', kind: 'love' };
    });

  // Called by the mini-games when they finish
  const rewardGame = ({ game, coins, xp, score }) =>
    act((p) => {
      let next = {
        ...p,
        coins: p.coins + coins,
        stats: {
          ...p.stats,
          happiness: p.stats.happiness + 10,
          energy: p.stats.energy - 8,
        },
        counters: { ...p.counters, games: p.counters.games + 1 },
        bestTreatScore:
          game === 'treats' ? Math.max(p.bestTreatScore || 0, score || 0) : p.bestTreatScore,
      };
      next = addHistory(next, `Played ${game === 'treats' ? 'Catch the Treat' : 'Guess the Mood'}: +${coins} coins`);
      next = gainXp(next, xp);
      return { pet: next, say: 'Yay! That was fun! 🎉', kind: 'happy' };
    });

  const buy = (itemId) =>
    act((p) => {
      const item = SHOP_ITEMS.find((i) => i.id === itemId);
      if (!item) return { error: 'That item does not exist.' };
      if (p.inventory.includes(itemId)) return { error: 'You already own this!' };
      if (p.level < item.level) return { error: `Unlocks at level ${item.level} 🔒` };
      if (p.coins < item.price) return { error: 'Not enough coins 🪙' };
      let next = {
        ...p,
        coins: p.coins - item.price,
        inventory: [...p.inventory, itemId],
        counters: { ...p.counters, purchases: p.counters.purchases + 1 },
      };
      next = addHistory(next, `Bought ${item.name} ${item.emoji}`);
      next = gainXp(next, 5);
      return { pet: next, say: `New ${item.name}! 🛍️`, kind: 'happy' };
    });

  const equip = (itemId) =>
    act((p) => {
      const item = SHOP_ITEMS.find((i) => i.id === itemId);
      if (!item || !p.inventory.includes(itemId)) return { error: 'You do not own this yet.' };
      const equipped = { ...p.equipped };
      if (equipped[item.category] === itemId) {
        delete equipped[item.category];
        return { pet: { ...p, equipped }, say: `Took off ${item.name}`, kind: 'info' };
      }
      equipped[item.category] = itemId;
      return { pet: addHistory({ ...p, equipped }, `Wearing ${item.name} ${item.emoji}`), say: 'Looking cute! 😍', kind: 'love' };
    });

  const release = () => {
    clearGame();
    setPet(null);
    setReaction(null);
  };

  return {
    pet,
    reaction,
    levelUpTo,
    dismissLevelUp: () => setLevelUpTo(null),
    adopt,
    feed,
    bath,
    toggleSleep,
    petPet,
    rewardGame,
    buy,
    equip,
    release,
  };
}