'use strict';

/**
 * Rewrites live `console.<method>(` calls to `logger.<method>(` and adds the
 * `import { logger } from '@core/logger';` line to any file it changed.
 *
 * The codemod REPLACES, it never deletes. Arguments, control flow and formatting are
 * untouched, so braceless `if (x) console.log(...)` bodies stay valid and every argument
 * expression still evaluates.
 *
 * Commented-out console calls (there are ~1,998 of them in this repo) are deliberately
 * left alone: matching is done against a mask in which the contents of comments, strings
 * and template literals have been blanked out.
 *
 * Usage:
 *   node tools/codemod-console-to-logger.js --dry-run
 *   node tools/codemod-console-to-logger.js --dry-run --dir=src/app/services
 *   node tools/codemod-console-to-logger.js --dir=src/app/services
 *
 * Review changes with `git diff` after applying; verify with `node tools/count-console.js`.
 */

const fs = require('fs');
const path = require('path');

const BS = String.fromCharCode(92);
const IMPORT_LINE = "import { logger } from '@core/logger';";
const METHODS = ['log', 'error', 'warn', 'info', 'debug', 'table', 'dir', 'trace'];

/** Directories/files never touched. `core` owns the logger and legitimately uses console. */
const SKIP = [
  /[\\/]app[\\/]core[\\/]/,
  /\.spec\.ts$/,
  /[\\/]node_modules[\\/]/,
];

/**
 * Returns a same-length copy of `src` in which the CONTENTS of line comments, block
 * comments, string literals and template literals are replaced by spaces. Newlines are
 * preserved so that offsets and line numbers stay identical to the original.
 *
 * Delimiters (quotes, backticks) are kept so the surrounding code structure still reads
 * correctly; only what is *inside* them is blanked.
 */
function maskNonCode(src) {
  const out = src.split('');
  const blank = i => { if (out[i] !== '\n') out[i] = ' '; };

  let i = 0;
  const n = src.length;

  while (i < n) {
    const c = src[i];
    const next = src[i + 1];

    // line comment
    if (c === '/' && next === '/') {
      blank(i); blank(i + 1);
      i += 2;
      while (i < n && src[i] !== '\n') { blank(i); i++; }
      continue;
    }

    // block comment
    if (c === '/' && next === '*') {
      blank(i); blank(i + 1);
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) { blank(i); i++; }
      if (i < n) { blank(i); blank(i + 1); i += 2; }
      continue;
    }

    // string / template literal
    if (c === "'" || c === '"' || c === '`') {
      const quote = c;
      i++; // keep the opening delimiter
      while (i < n) {
        if (src[i] === BS) { blank(i); blank(i + 1); i += 2; continue; }
        if (src[i] === quote) break;
        // an unterminated single/double quoted string cannot cross a newline
        if (quote !== '`' && src[i] === '\n') break;
        blank(i);
        i++;
      }
      i++; // keep the closing delimiter
      continue;
    }

    i++;
  }

  return out.join('');
}

/** Live `console.<method>(` occurrences, located against the mask. */
function findConsoleCalls(mask) {
  const re = new RegExp('console[ \\t]*\\.[ \\t]*(' + METHODS.join('|') + ')[ \\t]*\\(', 'g');
  const hits = [];
  let m;
  while ((m = re.exec(mask)) !== null) {
    hits.push({ index: m.index, method: m[1] });
  }
  return hits;
}

/**
 * Offset of the FIRST top-level `import` statement, or -1.
 *
 * We insert *before* the first import rather than after the last one on purpose. Finding
 * where an import ENDS requires knowing its terminating semicolon, and this codebase has
 * imports with no trailing semicolon (e.g. users/user/user.component.ts:3). A previous
 * version scanned `import ... ;` across newlines, so a semicolon-less import swallowed
 * everything up to the next `;` in real code and the logger import was injected inside a
 * class body. Anchoring on the START of the first import needs no end-detection and is
 * always a valid top-level position.
 */
function firstImportStart(mask) {
  const m = /^[ \t]*import\s/m.exec(mask);
  return m ? m.index : -1;
}

/** True if `offset` sits at brace/paren/bracket depth 0, i.e. genuine top level. */
function isTopLevel(mask, offset) {
  let depth = 0;
  for (let i = 0; i < offset; i++) {
    const c = mask[i];
    if (c === '{' || c === '(' || c === '[') depth++;
    else if (c === '}' || c === ')' || c === ']') depth--;
  }
  return depth === 0;
}

function alreadyImportsLogger(src) {
  return /from\s*['"]@core\/logger['"]/.test(src);
}

/**
 * Transforms one file's source.
 * Returns { changed, code, count, methods, warnings }.
 */
function transform(src) {
  const mask = maskNonCode(src);
  const hits = findConsoleCalls(mask);
  const warnings = [];

  if (hits.length === 0) {
    return { changed: false, code: src, count: 0, methods: {}, warnings };
  }

  // Apply right-to-left so earlier offsets stay valid.
  let code = src;
  const methods = {};
  for (let k = hits.length - 1; k >= 0; k--) {
    const { index, method } = hits[k];
    // Invariant: the mask told us this is code, so the original MUST read `console` here.
    if (code.slice(index, index + 7) !== 'console') {
      warnings.push(`offset ${index}: expected "console", found "${code.slice(index, index + 7)}" - SKIPPED`);
      continue;
    }
    methods[method] = (methods[method] || 0) + 1;
    code = code.slice(0, index) + 'logger' + code.slice(index + 7);
  }

  const replaced = hits.length - warnings.length;
  if (replaced === 0) {
    return { changed: false, code: src, count: 0, methods, warnings };
  }

  if (!alreadyImportsLogger(code)) {
    const importMask = maskNonCode(code);
    const at = firstImportStart(importMask);
    if (at === -1) {
      warnings.push('no import statement found - import prepended at top of file');
      code = IMPORT_LINE + '\n' + code;
    } else if (!isTopLevel(importMask, at)) {
      // Should be unreachable; refuse to write rather than corrupt the file.
      warnings.push('first import is not at top level - IMPORT NOT INSERTED');
      return { changed: false, code: src, count: 0, methods: {}, warnings };
    } else {
      code = code.slice(0, at) + IMPORT_LINE + '\n' + code.slice(at);
    }
  }

  return { changed: true, code, count: replaced, methods, warnings };
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== 'node_modules') walk(p, out);
    } else if (e.name.endsWith('.ts')) {
      out.push(p);
    }
  }
  return out;
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const dirArg = (args.find(a => a.startsWith('--dir=')) || '').split('=')[1];

  const workspace = path.resolve(__dirname, '..');
  const target = path.resolve(workspace, dirArg || 'src');

  if (!fs.existsSync(target)) {
    console.error('Target does not exist: ' + target);
    process.exit(1);
  }

  const files = walk(target).filter(f => !SKIP.some(rx => rx.test(f)));

  let changedFiles = 0;
  let totalReplacements = 0;
  const totalMethods = {};
  const allWarnings = [];

  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const res = transform(src);

    if (res.warnings.length) {
      res.warnings.forEach(w => allWarnings.push(path.relative(workspace, file) + ': ' + w));
    }
    if (!res.changed) continue;

    changedFiles++;
    totalReplacements += res.count;
    for (const k of Object.keys(res.methods)) {
      totalMethods[k] = (totalMethods[k] || 0) + res.methods[k];
    }

    if (!dryRun) fs.writeFileSync(file, res.code, 'utf8');
  }

  console.log('');
  console.log(dryRun ? '=== DRY RUN (no files written) ===' : '=== APPLIED ===');
  console.log('target            : ' + path.relative(workspace, target));
  console.log('files scanned     : ' + files.length);
  console.log('files changed     : ' + changedFiles);
  console.log('replacements      : ' + totalReplacements);
  console.log('by method         : ' + JSON.stringify(totalMethods));
  console.log('warnings          : ' + allWarnings.length);
  allWarnings.slice(0, 20).forEach(w => console.log('   ! ' + w));
  console.log('');
  if (!dryRun && changedFiles > 0) {
    console.log('Review with:  git diff');
    console.log('Verify with:  node tools/count-console.js' + (dirArg ? ' --dir=' + dirArg : ''));
    console.log('');
  }
}

if (require.main === module) main();

module.exports = { maskNonCode, findConsoleCalls, transform, walk, SKIP, IMPORT_LINE };
