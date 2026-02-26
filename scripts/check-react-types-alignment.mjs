import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packageJsonPath = resolve(process.cwd(), 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

const versions = {
  react: packageJson.dependencies?.react,
  'react-dom': packageJson.dependencies?.['react-dom'],
  '@types/react': packageJson.devDependencies?.['@types/react'],
  '@types/react-dom': packageJson.devDependencies?.['@types/react-dom'],
};

const required = Object.entries(versions).filter(([, version]) => !version);
if (required.length > 0) {
  const missing = required.map(([name]) => name).join(', ');
  console.error(`Missing required dependency versions in package.json: ${missing}`);
  process.exit(1);
}

const readMajor = (range) => {
  const match = String(range).match(/\d+/);
  return match ? Number(match[0]) : NaN;
};

const majors = Object.fromEntries(
  Object.entries(versions).map(([name, range]) => [name, readMajor(range)]),
);

const invalid = Object.entries(majors).filter(([, major]) => !Number.isInteger(major));
if (invalid.length > 0) {
  const labels = invalid.map(([name]) => `${name}=${versions[name]}`).join(', ');
  console.error(`Unable to parse major version for: ${labels}`);
  process.exit(1);
}

const runtimeMajor = majors.react;
const runtimeDomMajor = majors['react-dom'];
const typesMajor = majors['@types/react'];
const typesDomMajor = majors['@types/react-dom'];

const mismatches = [
  runtimeMajor !== runtimeDomMajor
    ? `react(${runtimeMajor}) != react-dom(${runtimeDomMajor})`
    : null,
  runtimeMajor !== typesMajor ? `react(${runtimeMajor}) != @types/react(${typesMajor})` : null,
  runtimeDomMajor !== typesDomMajor
    ? `react-dom(${runtimeDomMajor}) != @types/react-dom(${typesDomMajor})`
    : null,
]
  .filter(Boolean)
  .join('; ');

if (mismatches.length > 0) {
  console.error(`Dependency major version alignment check failed: ${mismatches}`);
  process.exit(1);
}

console.log(`Dependency major version alignment check passed: react family major ${runtimeMajor}.`);
