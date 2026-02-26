import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithAppProviders } from '../testUtils';

import { CreateNetworkPanel } from '../../components/panels/CreateNetworkPanel';
import { ztPost } from '../../api/ztApi';

vi.mock('../../api/ztApi', () => ({
  ztPost: vi.fn(),
}));

describe('CreateNetworkPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates network name input', () => {
    renderWithAppProviders(<CreateNetworkPanel />);

    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'team-net' } });

    expect((nameInput as HTMLInputElement).value).toBe('team-net');
  });

  it('fills payload defaults when button is clicked', () => {
    renderWithAppProviders(<CreateNetworkPanel />);

    fireEvent.click(screen.getByRole('button', { name: '⊛ Fill Defaults' }));

    const payload = screen.getByText(
      (content) => content.includes('192.168.192.1') && content.includes('my-network'),
    );

    expect(payload).toBeDefined();
  });

  it('keeps create button disabled without node id and does not call API', () => {
    renderWithAppProviders(<CreateNetworkPanel />);

    const createButton = screen.getByRole('button', { name: 'Create Network' });
    expect(createButton).toHaveProperty('disabled', true);

    fireEvent.click(createButton);

    expect(ztPost).not.toHaveBeenCalled();
    expect(screen.getByText('Connect in Settings first to provide a valid Node ID.')).toBeDefined();
  });
});
