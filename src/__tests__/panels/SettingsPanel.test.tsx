import { fireEvent, render, screen } from '@testing-library/react';
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
      apiMode: 'proxy',
      host: '',
      token: '',
      nodeId: '',
      connected: false,
    }));
  });

  it('reads initial connection prefs from app store state', () => {
    useAppStore.setState((state) => ({
      ...state,
      apiMode: 'direct',
      host: 'http://controller.local:9993',
      token: 'store-token',
    }));

    render(<SettingsPanel />);

    expect(
      (screen.getByLabelText('Use direct backend mode (bypass /api proxy)') as HTMLInputElement)
        .checked,
    ).toBe(true);
    expect((screen.getByLabelText('Direct API Host URL') as HTMLInputElement).value).toBe(
      'http://controller.local:9993',
    );
    expect((screen.getByLabelText('Auth Token') as HTMLInputElement).value).toBe('store-token');
  });

  it('restores mode, host, token and remember-token flag from persisted prefs after reload', () => {
    savePrefs({
      apiMode: 'direct',
      host: 'http://controller.local:9993',
      token: 'persisted-token',
      persistToken: true,
    });

    useAppStore.setState((state) => ({
      ...state,
      ...restoreConnectionStateFromPrefs(),
    }));

    render(<SettingsPanel />);

    expect(
      (screen.getByLabelText('Use direct backend mode (bypass /api proxy)') as HTMLInputElement)
        .checked,
    ).toBe(true);
    expect((screen.getByLabelText('Direct API Host URL') as HTMLInputElement).value).toBe(
      'http://controller.local:9993',
    );
    expect((screen.getByLabelText('Auth Token') as HTMLInputElement).value).toBe('persisted-token');
    expect(
      (screen.getByLabelText('Remember token on this device') as HTMLInputElement).checked,
    ).toBe(true);
  });

  it('keeps proxy mode without direct host input by default', () => {
    render(<SettingsPanel />);

    expect(
      (screen.getByLabelText('Use direct backend mode (bypass /api proxy)') as HTMLInputElement)
        .checked,
    ).toBe(false);
    expect(screen.queryByLabelText('Direct API Host URL')).toBeNull();
  });

  it('does not restore token when remember-token is disabled', () => {
    savePrefs({
      apiMode: 'direct',
      host: 'http://controller.local:9993',
      token: 'hidden-token',
      persistToken: false,
    });

    useAppStore.setState((state) => ({
      ...state,
      ...restoreConnectionStateFromPrefs(),
    }));

    render(<SettingsPanel />);

    expect((screen.getByLabelText('Direct API Host URL') as HTMLInputElement).value).toBe(
      'http://controller.local:9993',
    );
    expect((screen.getByLabelText('Auth Token') as HTMLInputElement).value).toBe('');
    expect(
      (screen.getByLabelText('Remember token on this device') as HTMLInputElement).checked,
    ).toBe(false);
  });

  it('allows toggling direct mode in form', () => {
    render(<SettingsPanel />);

    const toggle = screen.getByLabelText(
      'Use direct backend mode (bypass /api proxy)',
    ) as HTMLInputElement;
    fireEvent.click(toggle);

    expect(toggle.checked).toBe(true);
    expect(screen.getByLabelText('Direct API Host URL')).toBeTruthy();
  });
});
