import { useNavigate } from 'react-router-dom';

const MOBILE_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/networks', label: 'Networks' },
  { path: '/members', label: 'Members' },
  { path: '/settings', label: 'Settings' },
] as const;

export function MobileNav() {
  const navigate = useNavigate();

  return (
    <nav id="mob-nav" aria-label="Mobile navigation">
      {MOBILE_ITEMS.map((item) => (
        <button
          className="mob-nav-item"
          key={item.path}
          type="button"
          onClick={() => navigate(item.path)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
