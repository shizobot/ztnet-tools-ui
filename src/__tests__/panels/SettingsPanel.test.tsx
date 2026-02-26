import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SettingsPanel } from '../../components/panels/SettingsPanel';
import { restoreConnectionStateFromPrefs, savePrefs } from '../../hooks/useConnection';
import { useAppStore } from '../../store/appStore';

vi.mock('../../components/ui', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

describe('SettingsPanel', () => {
  beforeEach(() => {
    localStorage.clear();
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

    expect((screen.getByLabelText('API Host URL') as HTMLInputElement).value).toBe(
      'http://controller.local:9993',
    );
    expect((screen.getByLabelText('Auth Token') as HTMLInputElement).value).toBe('store-token');
  });

  it('restores host, token and remember-token flag from persisted prefs after reload', () => {
    savePrefs({
      host: 'http://controller.local:9993',
      token: 'persisted-token',
      persistToken: true,
    });

    useAppStore.setState((state) => ({
      ...state,
      ...restoreConnectionStateFromPrefs(),
    }));

    render(<SettingsPanel />);

    expect((screen.getByLabelText('API Host URL') as HTMLInputElement).value).toBe(
      'http://controller.local:9993',
    );
    expect((screen.getByLabelText('Auth Token') as HTMLInputElement).value).toBe('persisted-token');
    expect(
      (screen.getByLabelText('Remember token on this device') as HTMLInputElement).checked,
    ).toBe(true);
  });

  it('does not restore token when remember-token is disabled', () => {
    savePrefs({
      host: 'http://controller.local:9993',
      token: 'hidden-token',
      persistToken: false,
    });

    useAppStore.setState((state) => ({
      ...state,
      ...restoreConnectionStateFromPrefs(),
    }));

    render(<SettingsPanel />);

    expect((screen.getByLabelText('API Host URL') as HTMLInputElement).value).toBe(
      'http://controller.local:9993',
    );
    expect((screen.getByLabelText('Auth Token') as HTMLInputElement).value).toBe('');
    expect(
      (screen.getByLabelText('Remember token on this device') as HTMLInputElement).checked,
    ).toBe(false);
  });
});
