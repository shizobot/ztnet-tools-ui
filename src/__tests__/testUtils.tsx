import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ToastProvider } from '../components/ui/Toast';

export function renderWithAppProviders(ui: ReactElement) {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>{ui}</ToastProvider>
    </MemoryRouter>,
  );
}
