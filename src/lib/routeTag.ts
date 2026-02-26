const LAN_PREFIXES = ['10.', '192.168.'];

function extractTarget(target: string): string {
  return target.trim().split('/')[0] ?? '';
}

function isRfc1918_172(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4 || parts[0] !== '172') {
    return false;
  }

  const secondOctet = Number(parts[1]);
  return Number.isInteger(secondOctet) && secondOctet >= 16 && secondOctet <= 31;
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

  if (LAN_PREFIXES.some((prefix) => ip.startsWith(prefix)) || isRfc1918_172(ip)) {
    return 'lan';
  }

  return 'public';
}
