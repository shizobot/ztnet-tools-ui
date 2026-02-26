import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const stylesDir = 'src/styles';
const maxLines = 200;

const walkCss = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      return walkCss(fullPath);
    }

    return fullPath.endsWith('.css') ? [fullPath] : [];
  });

const offenders = walkCss(stylesDir)
  .map((filePath) => {
    const lineCount = readFileSync(filePath, 'utf8').split('\n').length;
    return { filePath, lineCount };
  })
  .filter(({ lineCount }) => lineCount > maxLines)
  .sort((a, b) => b.lineCount - a.lineCount);

if (offenders.length > 0) {
  console.error(`CSS size check failed: max ${maxLines} lines per file.`);
  offenders.forEach(({ filePath, lineCount }) => {
    console.error(` - ${filePath}: ${lineCount} lines`);
  });
  process.exit(1);
}

console.log(`CSS size check passed: all files in ${stylesDir} are <= ${maxLines} lines.`);
