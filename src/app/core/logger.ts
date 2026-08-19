import { environment } from '../../environments/environment';

/**
 * Central logger.
 *
 * In local development every level prints exactly as `console.*` always did.
 * In a deployed production build `log`, `warn`, `info` and `debug` become no-ops, while
 * `error` is deliberately kept so support can still triage a real crash from a user's
 * browser console.
 *
 * `environment` here is `src/environments/environment.ts`, the pair that `angular.json`
 * swaps for `environment.prod.ts` via `fileReplacements`. In this fork
 * `src/app/services/environment.ts` re-exports that same pair, so either import would
 * resolve correctly — but the direct import is used so the source of the flag is obvious
 * and stays correct if that re-export is ever replaced by a hardcoded copy (which is
 * exactly what happened in the VegaCharging fork).
 */

export type LogFn = (...args: any[]) => void;

export interface Logger {
  log: LogFn;
  warn: LogFn;
  info: LogFn;
  debug: LogFn;
  error: LogFn;
}

const noop: LogFn = () => {};

/** The hostname we are running under, or '' when there is no browser (SSR, unit tests). */
function currentHostname(): string {
  return typeof window !== 'undefined' && window.location ? window.location.hostname : '';
}

/**
 * True when the app is being served to a developer's own machine.
 *
 * This check is what keeps logging alive during local development, and it is the one
 * place this logger deliberately differs from the RadX-Frontend original.
 *
 * `angular.json` sets `"defaultConfiguration": "production"` on the **serve** target, so
 * `ng serve` delegates to `build:production`, `fileReplacements` swaps in
 * `environment.prod.ts`, and `environment.production` is therefore `true` even on
 * `npm start`. Gating on `environment.production` alone would make `npm start` silent —
 * the exact opposite of what is wanted. RadX-Frontend does not have this problem because
 * its serve target defaults to `development`.
 *
 * The hostname is injectable so specs can exercise both branches; production code calls
 * it with no argument.
 */
export function isLocalHost(hostname?: string): boolean {
  const host = hostname ?? currentHostname();
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '::1' ||
    host === '[::1]' ||
    host.endsWith('.local')
  );
}

/**
 * Builds a logger for a given environment.
 *
 * The console methods are bound at construction time so that devtools reports the
 * original call site instead of pointing every line back at this file.
 *
 * Exported separately from the `logger` singleton so specs can exercise both the
 * development and production branches without re-importing the module.
 */
export function createLogger(isProduction: boolean): Logger {
  return {
    log: isProduction ? noop : console.log.bind(console),
    warn: isProduction ? noop : console.warn.bind(console),
    info: isProduction ? noop : console.info.bind(console),
    debug: isProduction ? noop : console.debug.bind(console),
    error: console.error.bind(console),
  };
}

/**
 * The application-wide logger. Import this, never `console` directly.
 *
 * Silent only when this is a production build AND we are not on a developer machine.
 */
export const logger: Logger = createLogger(environment.production && !isLocalHost());
