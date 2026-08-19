'use strict';

/**
 * Verification oracle for the console -> logger migration.
 *
 * Reports live vs commented-out `console.*` usage, and how many `logger.*` calls exist,
 * using the same comment/string masking as the codemod. Run it before and after each
 * migration batch.
 *
 * Usage:
 *   node tools/count-console.js
 *   node tools/count-console.js --dir=src/app/pages/dashboards
 *   node tools/count-console.js --by-dir
 *   node tools/count-console.js --list        # every remaining live call site
 *   node tools/count-console.js --check       # exit 1 if any live console.* is found
 *
 * --check is the CI/pre-commit gate. `ng lint` cannot serve this purpose: the
 * `@angular-devkit/build-angular:tslint` builder was removed in Angular 12 and this project
 * is on 15, so `ng lint` fails outright and the `no-console` rule in tslint.json has been
 * inert for years. That is how 2,113 console calls accumulated despite the rule existing.
 *
 * A plain grep cannot replace this either: it would flag the 2,022 commented-out console
 * calls. This gate masks comments and strings, so it only fails on live code.
 */

const fs = require('fs');
const path = require('path');
const { maskNonCode, walk, SKIP } = require('./codemod-console-to-logger');

const ANY_CONSOLE = /console[ \t]*\.[ \t]*([a-zA-Z]+)[ \t]*\(/g;
const ANY_LOGGER = /\blogger[ \t]*\.[ \t]*([a-zA-Z]+)[ \t]*\(/g;

function countMatches(text, re) {
  const out = {};
  let m;
  re.lastIndex = 0;
  while ((m = re.exec(text)) !== null) out[m[1]] = (out[m[1]] || 0) + 1;
  return out;
}

function total(obj) {
  return Object.values(obj).reduce((a, b) => a + b, 0);
}

function main() {
  const args = process.argv.slice(2);
  const dirArg = (args.find(a => a.startsWith('--dir=')) || '').split('=')[1];
  const byDir = args.includes('--by-dir');
  const check = args.includes('--check');
  const list = args.includes('--list') || check;

  const workspace = path.resolve(__dirname, '..');
  const target = path.resolve(workspace, dirArg || 'src');
  const files = walk(target).filter(f => !SKIP.some(rx => rx.test(f)));

  let liveConsole = {};
  let allConsole = {};
  let loggerCalls = {};
  let filesWithLive = 0;
  const perDir = {};
  const sites = [];

  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const mask = maskNonCode(src);

    const live = countMatches(mask, ANY_CONSOLE);
    const all = countMatches(src, ANY_CONSOLE);
    const log = countMatches(mask, ANY_LOGGER);

    for (const k of Object.keys(live)) liveConsole[k] = (liveConsole[k] || 0) + live[k];
    for (const k of Object.keys(all)) allConsole[k] = (allConsole[k] || 0) + all[k];
    for (const k of Object.keys(log)) loggerCalls[k] = (loggerCalls[k] || 0) + log[k];

    const liveN = total(live);
    if (liveN > 0) {
      filesWithLive++;
      const rel = path.relative(workspace, file).split(path.sep).join('/');
      const dir = rel.split('/').slice(0, 4).join('/');
      perDir[dir] = (perDir[dir] || 0) + liveN;

      if (list) {
        ANY_CONSOLE.lastIndex = 0;
        let m;
        while ((m = ANY_CONSOLE.exec(mask)) !== null) {
          const line = src.slice(0, m.index).split('\n').length;
          sites.push(rel + ':' + line + '  console.' + m[1]);
        }
      }
    }
  }

  const liveTotal = total(liveConsole);
  const commented = total(allConsole) - liveTotal;

  console.log('');
  console.log('target                 : ' + path.relative(workspace, target));
  console.log('files scanned          : ' + files.length);
  console.log('files with LIVE console: ' + filesWithLive);
  console.log('');
  console.log('LIVE console calls     : ' + liveTotal + '  ' + JSON.stringify(liveConsole));
  console.log('commented-out console  : ' + commented);
  console.log('logger.* calls         : ' + total(loggerCalls) + '  ' + JSON.stringify(loggerCalls));
  console.log('');

  if (byDir) {
    console.log('--- live console by directory ---');
    Object.entries(perDir)
      .sort((a, b) => b[1] - a[1])
      .forEach(([d, n]) => console.log('  ' + String(n).padStart(5) + '  ' + d));
    console.log('');
  }

  if (list) {
    console.log('--- remaining live call sites (' + sites.length + ') ---');
    sites.forEach(s => console.log('  ' + s));
    console.log('');
  }

  if (check) {
    if (liveTotal > 0) {
      console.error('FAIL: ' + liveTotal + ' live console.* call(s) in ' + filesWithLive + ' file(s).');
      console.error('Use the logger instead:  import { logger } from \'@core/logger\';');
      console.error('It silences log/warn/info/debug in production builds and keeps error.');
      process.exit(1);
    }
    console.log('OK: no live console.* calls.');
  }
}

if (require.main === module) main();
