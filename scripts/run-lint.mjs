import { spawnSync } from 'node:child_process';

const targets = process.argv.slice(2);
const lintTargets = targets.length > 0 ? targets : ['.'];

const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: true });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

run('npm', ['run', 'check:styles']);
run('npm', ['run', 'check:dead-exports']);
run('eslint', [...lintTargets, '--max-warnings', '0']);
run('prettier', ['--check', ...lintTargets]);
