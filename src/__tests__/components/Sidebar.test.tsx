import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { Sidebar } from '../../components/layout/Sidebar';

function renderSidebar() {
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Sidebar />
    </MemoryRouter>,
  );

  const sidebar = document.getElementById('sidebar');
  document.getElementById('menuBtn')?.remove();
  const menuButton = document.createElement('button');
  menuButton.id = 'menuBtn';
  menuButton.classList.add('open');
  document.body.append(menuButton);

  if (!sidebar) {
    throw new Error('Sidebar element was not rendered');
  }

  const overlay = screen.getByRole('button', { name: /close sidebar navigation/i });
  sidebar.classList.add('open');
  overlay.classList.add('show');

  return { overlay, sidebar, menuButton };
}

describe('Sidebar overlay interactions', () => {
  it('closes sidebar with mouse click', async () => {
    const user = userEvent.setup();
    const { overlay, sidebar, menuButton } = renderSidebar();

    await user.click(overlay);

    expect(sidebar.classList.contains('open')).toBe(false);
    expect(overlay.classList.contains('show')).toBe(false);
    expect(menuButton.classList.contains('open')).toBe(false);
  });

  it('closes sidebar with Enter and Space keyboard keys', async () => {
    const user = userEvent.setup();
    const { overlay, sidebar, menuButton } = renderSidebar();

    overlay.focus();
    await user.keyboard('{Enter}');

    expect(sidebar.classList.contains('open')).toBe(false);
    expect(overlay.classList.contains('show')).toBe(false);
    expect(menuButton.classList.contains('open')).toBe(false);

    sidebar.classList.add('open');
    overlay.classList.add('show');
    menuButton.classList.add('open');

    overlay.focus();
    await user.keyboard(' ');

    expect(sidebar.classList.contains('open')).toBe(false);
    expect(overlay.classList.contains('show')).toBe(false);
    expect(menuButton.classList.contains('open')).toBe(false);
  });
});
