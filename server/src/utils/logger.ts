import pino, {Logger} from 'pino';
import path from 'path';

const DESTINATION = path.resolve(path.join(process.cwd(), 'logs'));

const createLoggers = () => {
  const logger = pino(pino.extreme(DESTINATION));

  setInterval(() => {
    logger.flush();
  }, 10000).unref();

  const handler = pino.final(logger, (err, finalLogger, evt) => {
    finalLogger.info(`${evt} caught`);
    if (err) finalLogger.error(err, 'error caused exit');
    process.exit(err ? 1 : 0);
  });

  process.on('beforeExit', () => handler(null, 'beforeExit'));
  process.on('exit', () => handler(null, 'exit'));
  process.on('uncaughtException', err => handler(err, 'uncaughtException'));
  process.on('SIGINT', () => handler(null, 'SIGINT'));
  process.on('SIGQUIT', () => handler(null, 'SIGQUIT'));
  process.on('SIGTERM', () => handler(null, 'SIGTERM'));

  return {
    logger,
    loggerDev: process.env.NODE_ENV !== 'production' ? pino(pino.extreme()) : fakeLogger,
  };
};

const fakeLogger: Logger = {
  warn: () => null,
  info: () => null,
  debug: () => null,
  error: () => null,
  fatal: () => null,
} as any;

export const loggers = createLoggers();
