const LAN_PREFIXES = [
  '10.',
  '192.168.',
  '172.16.',
  '172.17.',
  '172.18.',
  '172.19.',
  '172.2',
  '172.30.',
  '172.31.',
];

function extractTarget(target: string): string {
  return target.trim().split('/')[0] ?? '';
}

export function routeTag(target: string): 'default' | 'lan' | 'public' {
  const normalized = target.trim();
  if (normalized === '0.0.0.0/0' || normalized === '::/0') {
    return 'default';
  }

  const ip = extractTarget(normalized);
  if (ip.startsWith('fc') || ip.startsWith('fd')) {
    return 'lan';
  }

  if (LAN_PREFIXES.some((prefix) => ip.startsWith(prefix))) {
    return 'lan';
  }

  return 'public';
}
