import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithAppProviders } from '../testUtils';

import { DashboardPanel } from '../../components/panels/DashboardPanel';

describe('DashboardPanel', () => {
  it('renders dashboard heading and description', () => {
    renderWithAppProviders(<DashboardPanel />);

    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('ZeroTier Controller Overview')).toBeDefined();
  });
});
