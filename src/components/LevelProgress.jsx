import { xpForLevel } from '../utils/gameLogic';

export default function LevelProgress({ level, xp }) {
  const needed = xpForLevel(level);
  const percent = Math.min(100, Math.round((xp / needed) * 100));

  return (
    <div className="level-card">
      <div className="level-top">
        <strong>⭐ Level {level}</strong>
        <small>
          {xp} / {needed} XP
        </small>
      </div>
      <div className="bar">
        <div className="bar-fill xp-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}