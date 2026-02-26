import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { ToastProvider } from './components/ui';
import { restoreConnectionStateFromPrefs } from './hooks/useConnection';
import { router } from './router';
import { useAppStore } from './store/appStore';

useAppStore.setState((state) => ({
  ...state,
  ...restoreConnectionStateFromPrefs(),
}));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </React.StrictMode>,
);
