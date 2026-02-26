import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CreateNetworkPanel } from '../../components/panels/CreateNetworkPanel';

describe('CreateNetworkPanel', () => {
  it('updates network name input', () => {
    render(<CreateNetworkPanel />);

    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'team-net' } });

    expect((nameInput as HTMLInputElement).value).toBe('team-net');
  });

  it('fills payload defaults when button is clicked', () => {
    render(<CreateNetworkPanel />);

    fireEvent.click(screen.getByRole('button', { name: '⊛ Fill Defaults' }));

    const payload = screen.getByText(
      (content) => content.includes('192.168.192.1') && content.includes('my-network'),
    );

    expect(payload).toBeDefined();
  });
});
