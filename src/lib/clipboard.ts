export async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard?.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

export async function copyEl(id: string): Promise<void> {
  const value = document.getElementById(id)?.textContent ?? '';
  await copyText(value);
}
