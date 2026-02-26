import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from '../../components/ui/Badge';

describe('Badge', () => {
  it('renders content with default tone class', () => {
    render(<Badge>Connected</Badge>);

    const badge = screen.getByText('Connected');
    expect(badge.className).toContain('badge');
    expect(badge.className).toContain('b-gray');
  });

  it('applies provided tone class', () => {
    render(<Badge tone="green">Online</Badge>);

    expect(screen.getByText('Online').className).toContain('b-green');
  });
});
