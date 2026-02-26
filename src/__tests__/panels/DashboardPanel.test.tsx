import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DashboardPanel } from '../../components/panels/DashboardPanel';

describe('DashboardPanel', () => {
  it('renders dashboard heading and description', () => {
    render(<DashboardPanel />);

    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('ZeroTier Controller Overview')).toBeDefined();
  });
});
