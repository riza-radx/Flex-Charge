import { Injectable } from '@angular/core';
import { Logger, LogFn, logger } from './logger';

/**
 * Injectable wrapper around the `logger` singleton.
 *
 * The migrated files import the `logger` singleton directly — injecting a service into
 * every one of them would have meant adding a constructor parameter to classes that often
 * have no constructor at all.
 *
 * This service exists for new code that prefers DI, and as the seam for routing errors
 * to a remote sink (Sentry/Datadog) later without touching any call site.
 *
 * The members are assigned from the already-bound singleton functions, so devtools
 * still reports the original call site.
 */
@Injectable({ providedIn: 'root' })
export class LoggerService implements Logger {
  readonly log: LogFn = logger.log;
  readonly warn: LogFn = logger.warn;
  readonly info: LogFn = logger.info;
  readonly debug: LogFn = logger.debug;
  readonly error: LogFn = logger.error;
}
