import { Home, Sparkles, Gamepad2, ShoppingBag, BookOpen } from 'lucide-react';

const TABS = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'activities', label: 'Activities', Icon: Sparkles },
  { id: 'games', label: 'Mini-Games', Icon: Gamepad2 },
  { id: 'shop', label: 'Shop', Icon: ShoppingBag },
  { id: 'journal', label: 'Journal', Icon: BookOpen },
];

export default function Navigation({ view, onChange }) {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`nav-btn ${view === id ? 'active' : ''}`}
          onClick={() => onChange(id)}
        >
          <Icon size={22} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}