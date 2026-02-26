import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SettingsPanel } from '../../components/panels/SettingsPanel';
import { useAppStore } from '../../store/appStore';

vi.mock('../../components/ui', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

describe('SettingsPanel', () => {
  beforeEach(() => {
    useAppStore.setState((state) => ({
      ...state,
      host: '',
      token: '',
      nodeId: '',
      connected: false,
    }));
  });
  it('reads initial connection prefs from app store state', () => {
    useAppStore.setState((state) => ({
      ...state,
      host: 'http://controller.local:9993',
      token: 'store-token',
    }));

    render(<SettingsPanel />);

    expect((screen.getByLabelText('API Host URL') as HTMLInputElement).value).toBe('http://controller.local:9993');
    expect((screen.getByLabelText('Auth Token') as HTMLInputElement).value).toBe('store-token');
  });
});
