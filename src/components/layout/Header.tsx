import { useNavigate } from 'react-router-dom';
import { toggleSidebar } from './Sidebar';

export function Header() {
  const navigate = useNavigate();

  return (
    <header>
      <button id="menuBtn" className="menu-btn" type="button" onClick={toggleSidebar} aria-label="Menu" />
      <button type="button" onClick={() => navigate('/')}>
        ZTNet Tools UI
      </button>
      <button type="button" onClick={() => navigate('/settings')}>
        Settings
      </button>
    </header>
  );
}
