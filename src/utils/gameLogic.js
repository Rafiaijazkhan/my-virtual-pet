export const clamp = (n, min = 0, max = 100) =>
  Math.min(max, Math.max(min, n));

// XP needed to go from this level to the next one
export const xpForLevel = (level) => 50 + (level - 1) * 30;

export function createPet(type, name) {
  const now = Date.now();
  return {
    type,
    name,
    adoptedAt: now,
    lastUpdate: now,
    stats: { hunger: 80, happiness: 80, energy: 80, cleanliness: 80, health: 100 },
    coins: 50,
    xp: 0,
    level: 1,
    sleeping: false,
    inventory: [],
    equipped: {},
    history: [],
    counters: { fed: 0, games: 0, purchases: 0, baths: 0, pets: 0, sleeps: 0 },
    milestones: [],
    bestTreatScore: 0,
  };
}

// Health depends on how well the pet is cared for
export function calcHealth(stats) {
  return clamp(
    Math.round(
      stats.hunger * 0.35 +
        stats.cleanliness * 0.25 +
        stats.happiness * 0.25 +
        stats.energy * 0.15
    )
  );
}

// Makes stats change over time, even while the user is away
export function applyDecay(pet, now = Date.now()) {
  const elapsedMin = Math.max(0, (now - pet.lastUpdate) / 60000);
  // At most 8 hours of decay, so the pet never suffers too much
  const minutes = Math.min(elapsedMin, 480);

  const s = { ...pet.stats };

  if (pet.sleeping) {
    s.energy = clamp(s.energy + minutes * 4);
    s.hunger = clamp(s.hunger - minutes * 0.2);
    s.cleanliness = clamp(s.cleanliness - minutes * 0.1);
  } else {
    s.hunger = clamp(s.hunger - minutes * 0.5);
    s.happiness = clamp(s.happiness - minutes * 0.4);
    s.cleanliness = clamp(s.cleanliness - minutes * 0.3);
    s.energy = clamp(s.energy - minutes * 0.2);
  }

  // While the user is away, stats never fall below 10
  if (elapsedMin > 5) {
    ['hunger', 'happiness', 'cleanliness'].forEach((k) => {
      if (pet.stats[k] >= 10) s[k] = Math.max(10, s[k]);
    });
  }

  s.health = calcHealth(s);
  const wokeUp = pet.sleeping && s.energy >= 100;
  return { ...pet, stats: s, sleeping: wokeUp ? false : pet.sleeping, lastUpdate: now };
}

// Chooses the pet's mood from its stats
export function getMood(pet) {
  const s = pet.stats;
  if (pet.sleeping) return 'sleeping';
  if (s.hunger < 25) return 'hungry';
  if (s.energy < 25) return 'sleepy';
  if (s.cleanliness < 25) return 'dirty';
  if (s.happiness < 30) return 'sad';
  if (s.happiness > 80 && s.hunger > 60) return 'excited';
  return 'happy';
}

export const MOOD_TEXT = {
  sleeping: 'Zzz... 💤',
  hungry: "I'm hungry!",
  sleepy: "I'm sleepy!",
  dirty: 'I need a bath!',
  sad: 'I missed you!',
  excited: "Let's play!",
  happy: 'I love being with you!',
};
