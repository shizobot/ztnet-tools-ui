import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MembersPanel } from '../../components/panels/MembersPanel';
import { NetworksPanel } from '../../components/panels/NetworksPanel';
import { RawApiPanel } from '../../components/panels/RawApiPanel';
import { StatusPanel } from '../../components/panels/StatusPanel';
import { useAppStore } from '../../store/appStore';

vi.mock('../../components/ui', async () => {
  const actual = await vi.importActual('../../components/ui');
  return {
    ...actual,
    useToast: () => ({ toast: vi.fn() }),
  };
});

const okJson = (payload: unknown): Response =>
  ({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: vi.fn().mockResolvedValue(payload),
  }) as unknown as Response;

describe('endpoint switching via store host', () => {
  beforeEach(() => {
    useAppStore.setState((state) => ({
      ...state,
      host: 'http://controller.local:9993',
      token: 'token-1',
      selectedNwid: 'abcd1234',
      networks: [],
    }));
  });

  it('uses configured host for /status, /networks, /members and /api panels', async () => {
    const urls: string[] = [];
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      urls.push(url);

      if (url.endsWith('/controller/network')) return okJson(['abcd1234']);
      if (url.endsWith('/controller/network/abcd1234'))
        return okJson({ id: 'abcd1234', name: 'Main' });
      if (url.endsWith('/controller/network/abcd1234/member')) {
        return okJson({ m1: { authorized: true, name: 'member-one' } });
      }
      if (url.endsWith('/status')) return okJson({ address: 'node-1' });

      return okJson({});
    });
    globalThis.fetch = fetchMock as typeof fetch;

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <StatusPanel />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: '↻ Refresh' }));

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <NetworksPanel />
      </MemoryRouter>,
    );

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <MembersPanel />
      </MemoryRouter>,
    );

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <RawApiPanel />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => {
      expect(urls.some((url) => url === 'http://controller.local:9993/status')).toBe(true);
      expect(urls.some((url) => url === 'http://controller.local:9993/controller/network')).toBe(
        true,
      );
      expect(
        urls.some(
          (url) => url === 'http://controller.local:9993/controller/network/abcd1234/member',
        ),
      ).toBe(true);
    });
  });
});
