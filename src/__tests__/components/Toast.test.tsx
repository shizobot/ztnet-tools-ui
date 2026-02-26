import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ToastProvider, useToast } from '../../components/ui/Toast';

function Trigger() {
  const { toast } = useToast();
  return <button onClick={() => toast('saved', 'ok')}>notify</button>;
}

describe('Toast', () => {
  it('renders toast message through provider context', () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'notify' }));

    expect(screen.getByText(/saved/)).toBeDefined();

    act(() => {
      vi.advanceTimersByTime(3200);
    });
    expect(screen.queryByText(/saved/)).toBeNull();
    vi.useRealTimers();
  });

  it('throws when hook is used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<Trigger />)).toThrow('useToast must be used within ToastProvider');

    spy.mockRestore();
  });
});
