const KEY = 'petopia-save';

export function loadGame() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveGame(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // ignore save errors
  }
}

export function clearGame() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}