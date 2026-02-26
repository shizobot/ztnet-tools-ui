type TerminalProps = {
  value: string;
  state?: 'ok' | 'err' | 'idle';
};

export function Terminal({ value, state = 'idle' }: TerminalProps) {
  return (
    <pre className={['resp', state === 'idle' ? '' : state].filter(Boolean).join(' ')}>{value}</pre>
  );
}
