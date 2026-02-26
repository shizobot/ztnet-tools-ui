import { execSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const uiDir = 'src/components/ui';
const componentFiles = readdirSync(uiDir)
  .filter((file) => file.endsWith('.tsx'))
  .sort();

const unused = [];

for (const file of componentFiles) {
  const component = file.replace(/\.tsx$/, '');
  const tokens = component === 'Toast' ? ['ToastProvider', 'useToast'] : [component];

  const cmd = [
    'rg',
    '-n',
    `"${tokens.map((token) => `\\b${token}\\b`).join('|')}"`,
    'src',
    "--glob '!src/__tests__/**'",
    "--glob '!src/components/ui/index.ts'",
    `--glob '!${join(uiDir, file)}'`,
  ].join(' ');

  let output = '';
  try {
    output = execSync(cmd, { encoding: 'utf8' }).trim();
  } catch (error) {
    output = `${error.stdout ?? ''}`.trim();
  }

  if (!output) {
    unused.push(file);
  }
}

if (unused.length) {
  console.error('Unused UI components in production code:');
  for (const file of unused) {
    console.error(`- ${join(uiDir, file)}`);
  }
  process.exit(1);
}

console.log('All src/components/ui/*.tsx components are used in production code.');
