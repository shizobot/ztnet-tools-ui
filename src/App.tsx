import { Outlet } from 'react-router-dom';
import { Fab } from './components/layout/Fab';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Sidebar } from './components/layout/Sidebar';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/panels.css';

export default function App(): JSX.Element {
  return (
    <>
      <Header />
      <div className="app-body">
        <Sidebar />
        <main>
          <Outlet />
        </main>
      </div>
      <MobileNav />
      <Fab />
    </>
  );
}
