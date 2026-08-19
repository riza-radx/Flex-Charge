import { TestBed } from '@angular/core/testing';
import { createLogger, isLocalHost, logger } from './logger';
import { LoggerService } from './logger.service';

/**
 * Note: the exported `logger` singleton binds its console methods at module load,
 * which happens before any spy can be installed. The behavioural assertions therefore
 * exercise `createLogger`, which is the same code path; the singleton is only checked
 * for shape and for being wired to the correct environment.
 */
describe('createLogger', () => {
  const VERBOSE: Array<'log' | 'warn' | 'info' | 'debug'> = ['log', 'warn', 'info', 'debug'];

  describe('development (production === false)', () => {
    VERBOSE.forEach(level => {
      it(`forwards ${level} to console.${level}`, () => {
        const spy = spyOn(console, level);
        createLogger(false)[level]('message', { id: 1 });
        expect(spy).toHaveBeenCalledWith('message', { id: 1 });
      });
    });

    it('forwards error to console.error', () => {
      const spy = spyOn(console, 'error');
      createLogger(false).error('boom');
      expect(spy).toHaveBeenCalledWith('boom');
    });
  });

  describe('production (production === true)', () => {
    VERBOSE.forEach(level => {
      it(`silences ${level}`, () => {
        const spy = spyOn(console, level);
        createLogger(true)[level]('message');
        expect(spy).not.toHaveBeenCalled();
      });
    });

    it('still forwards error to console.error', () => {
      const spy = spyOn(console, 'error');
      createLogger(true).error('boom', new Error('x'));
      expect(spy).toHaveBeenCalled();
    });

    it('accepts any arguments without throwing when silenced', () => {
      const prod = createLogger(true);
      expect(() => prod.log('a', 1, null, undefined, { deep: { nested: true } })).not.toThrow();
    });
  });

  describe('the exported singleton', () => {
    it('exposes every level as a function', () => {
      [...VERBOSE, 'error'].forEach(level => {
        expect(typeof (logger as any)[level]).toBe('function');
      });
    });

    it('is wired to src/environments/environment, so logging is live in dev', () => {
      // Guards against the singleton being pointed at a copy of the environment that is
      // not swapped by fileReplacements. This fork re-exports the swapped pair correctly,
      // but the VegaCharging fork does not, so the guard is kept in both.
      //
      // The singleton binds its console methods at module load, before any spy can be
      // installed, so a spy assertion cannot work here. Identity against the shared
      // noop is the reliable check: if these were no-ops, logging would be dead in dev.
      const productionNoop = createLogger(true).log;
      expect(logger.log).not.toBe(productionNoop);
      expect(logger.warn).not.toBe(productionNoop);
      expect(logger.info).not.toBe(productionNoop);
      expect(logger.debug).not.toBe(productionNoop);
    });

    it('uses one shared noop for every silenced level in production', () => {
      const prod = createLogger(true);
      expect(prod.log).toBe(prod.warn);
      expect(prod.log).toBe(prod.info);
      expect(prod.log).toBe(prod.debug);
      expect(prod.error).not.toBe(prod.log);
    });
  });
});

/**
 * `isLocalHost` is the reason logging survives `npm start` on this fork: `angular.json`
 * sets `"defaultConfiguration": "production"` on the serve target, so
 * `environment.production` is `true` even locally. Without this check the dev console
 * would be silent.
 */
describe('isLocalHost', () => {
  const LOCAL = ['localhost', '127.0.0.1', '::1', '[::1]', 'my-machine.local'];
  const REMOTE = [
    'flexcharge.radx.app',
    'app.radx.app',
    'api.radx.app',
    'radx.app',
    // Must not be fooled by a hostname that merely contains a local-looking substring.
    'localhost.attacker.com',
    'notlocalhost',
    '127.0.0.1.example.com',
    '',
  ];

  LOCAL.forEach(host => {
    it(`treats ${host || '(empty)'} as local`, () => {
      expect(isLocalHost(host)).toBe(true);
    });
  });

  REMOTE.forEach(host => {
    it(`treats ${host || '(empty)'} as NOT local`, () => {
      expect(isLocalHost(host)).toBe(false);
    });
  });

  it('reads the live hostname when called with no argument', () => {
    // Karma serves on localhost, so this is the dev branch.
    expect(isLocalHost()).toBe(isLocalHost(window.location.hostname));
  });
});

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
  });

  it('is created', () => {
    expect(service).toBeTruthy();
  });

  it('exposes every level as a function', () => {
    (['log', 'warn', 'info', 'debug', 'error'] as const).forEach(level => {
      expect(typeof service[level]).toBe('function');
    });
  });

  it('delegates to the same functions as the logger singleton', () => {
    expect(service.log).toBe(logger.log);
    expect(service.error).toBe(logger.error);
  });
});
