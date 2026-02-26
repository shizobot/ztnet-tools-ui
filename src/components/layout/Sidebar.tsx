import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard' },
  { path: '/status', label: 'Status' },
  { path: '/networks', label: 'Networks' },
  { path: '/members', label: 'Members' },
  { path: '/api', label: 'Raw API' },
  { path: '/curl', label: 'Curl' },
  { path: '/settings', label: 'Settings' },
] as const;

export function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebarOverlay');
  const mb = document.getElementById('menuBtn');

  if (!sb || !ov || !mb) {
    return;
  }

  const open = sb.classList.toggle('open');
  ov.classList.toggle('show', open);
  mb.classList.toggle('open', open);
}

export function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('show');
  document.getElementById('menuBtn')?.classList.remove('open');
}

export function Sidebar() {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    closeSidebar();
  };

  return (
    <>
      <button
        className="sidebar-overlay"
        id="sidebarOverlay"
        type="button"
        aria-label="Close sidebar"
        onClick={closeSidebar}
      />
      <aside id="sidebar" aria-label="Primary navigation">
        <nav>
          {NAV_ITEMS.map((item) => (
            <button key={item.path} type="button" onClick={() => handleNavigate(item.path)}>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
