import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from '../../components/ui/Badge';

describe('Badge', () => {
  it('renders provided value', () => {
    render(<Badge value={7} />);
    expect(screen.getByText('7')).toBeDefined();
  });

  it('adds alert and custom classes', () => {
    render(<Badge value="warn" alert className="extra" />);
    expect(screen.getByText('warn').className).toContain('badge');
    expect(screen.getByText('warn').className).toContain('show');
    expect(screen.getByText('warn').className).toContain('extra');
  });
});
