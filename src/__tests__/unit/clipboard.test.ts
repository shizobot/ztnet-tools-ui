import { beforeEach, describe, expect, it, vi } from 'vitest';

import { copyEl, copyText } from '../../lib/clipboard';

describe('clipboard helpers', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('uses navigator.clipboard.writeText when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    await copyText('hello');

    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('falls back to textarea + execCommand when clipboard API fails', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, 'execCommand', { value: execCommand, configurable: true });
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    await copyText('fallback');

    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(document.querySelector('textarea')).toBeNull();
  });

  it('copies textContent from an element by id', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    const el = document.createElement('pre');
    el.id = 'output';
    el.textContent = 'sample text';
    document.body.appendChild(el);

    await copyEl('output');

    expect(writeText).toHaveBeenCalledWith('sample text');
  });
});
