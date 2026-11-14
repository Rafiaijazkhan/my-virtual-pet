// Foods: can be bought again and again
export const FOODS = [
  { id: 'carrot', name: 'Carrot', emoji: '🥕', price: 0, hunger: 15, happiness: 0, xp: 2 },
  { id: 'apple', name: 'Apple', emoji: '🍎', price: 5, hunger: 25, happiness: 3, xp: 4 },
  { id: 'fish', name: 'Fish', emoji: '🐟', price: 10, hunger: 40, happiness: 5, xp: 6 },
  { id: 'cake', name: 'Cake', emoji: '🍰', price: 20, hunger: 30, happiness: 20, xp: 10 },
  { id: 'feast', name: 'Big Feast', emoji: '🍗', price: 35, hunger: 70, happiness: 10, xp: 14 },
];

// Accessories: bought one time, then equipped
export const SHOP_ITEMS = [
  { id: 'hat-party', name: 'Party Hat', category: 'hats', emoji: '🥳', price: 30, level: 1 },
  { id: 'hat-crown', name: 'Royal Crown', category: 'hats', emoji: '👑', price: 120, level: 4 },
  { id: 'hat-wizard', name: 'Wizard Hat', category: 'hats', emoji: '🧙', price: 80, level: 3 },
  { id: 'bow-pink', name: 'Pink Bow', category: 'bows', emoji: '🎀', price: 25, level: 1 },
  { id: 'bow-flower', name: 'Flower Clip', category: 'bows', emoji: '🌸', price: 45, level: 2 },
  { id: 'glasses-cool', name: 'Cool Shades', category: 'glasses', emoji: '😎', price: 50, level: 2 },
  { id: 'glasses-nerd', name: 'Smart Glasses', category: 'glasses', emoji: '🤓', price: 60, level: 3 },
  { id: 'collar-bell', name: 'Bell Collar', category: 'collars', emoji: '🔔', price: 35, level: 1 },
  { id: 'collar-star', name: 'Star Collar', category: 'collars', emoji: '⭐', price: 70, level: 3 },
  { id: 'toy-ball', name: 'Bouncy Ball', category: 'toys', emoji: '⚽', price: 40, level: 1 },
  { id: 'toy-teddy', name: 'Teddy Bear', category: 'toys', emoji: '🧸', price: 75, level: 2 },
  { id: 'bed-cozy', name: 'Cozy Bed', category: 'beds', emoji: '🛏️', price: 90, level: 2 },
  { id: 'bed-cloud', name: 'Cloud Bed', category: 'beds', emoji: '☁️', price: 150, level: 5 },
];

export const CATEGORIES = ['hats', 'bows', 'glasses', 'collars', 'toys', 'beds'];