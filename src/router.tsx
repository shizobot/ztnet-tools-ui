import { createBrowserRouter } from 'react-router-dom';
import { CurlBuilderPanel } from './components/panels/CurlBuilderPanel';
import { CreateNetworkPanel } from './components/panels/CreateNetworkPanel';
import { DashboardPanel } from './components/panels/DashboardPanel';
import { MemberDetailPanel } from './components/panels/MemberDetailPanel';
import { MembersPanel } from './components/panels/MembersPanel';
import { NetworkConfigPanel } from './components/panels/NetworkConfigPanel';
import { NetworksPanel } from './components/panels/NetworksPanel';
import { RawApiPanel } from './components/panels/RawApiPanel';
import { SettingsPanel } from './components/panels/SettingsPanel';
import { StatusPanel } from './components/panels/StatusPanel';

export const router = createBrowserRouter([
  { path: '/', element: <DashboardPanel /> },
  { path: '/status', element: <StatusPanel /> },
  { path: '/networks', element: <NetworksPanel /> },
  { path: '/networks/create', element: <CreateNetworkPanel /> },
  { path: '/networks/:nwid', element: <NetworkConfigPanel /> },
  { path: '/members', element: <MembersPanel /> },
  { path: '/members/:nwid/:id', element: <MemberDetailPanel /> },
  { path: '/api', element: <RawApiPanel /> },
  { path: '/curl', element: <CurlBuilderPanel /> },
  { path: '/settings', element: <SettingsPanel /> },
]);
