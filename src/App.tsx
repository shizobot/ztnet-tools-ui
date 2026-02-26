import { Outlet } from 'react-router-dom';
import { Fab } from './components/layout/Fab';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Sidebar } from './components/layout/Sidebar';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout-header.css';
import './styles/layout-sidebar.css';
import './styles/layout-main.css';
import './styles/components-cards.css';
import './styles/components-forms.css';
import './styles/components-forms-advanced.css';
import './styles/components-forms-network.css';
import './styles/components-forms-inputs.css';
import './styles/components-buttons.css';
import './styles/components-badges.css';
import './styles/components-tables.css';
import './styles/components-network.css';
import './styles/components-terminal-tags.css';
import './styles/components-feedback.css';
import './styles/components-toast.css';
import './styles/components-mobile.css';
import './styles/panels.css';
import './styles/layout-responsive.css';
import './styles/layout-responsive-tablet.css';

export default function App() {
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
