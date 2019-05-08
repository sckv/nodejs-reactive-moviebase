import pino from 'pino';
import path from 'path';

const DESTINATION = path.resolve(path.join(process.cwd(), 'loggess'));

const createLogger = () => {
  const loggerInstance = pino(pino.extreme(DESTINATION));

  setInterval(() => {
    loggerInstance.flush();
  }, 10000);

  const handler = pino.final(loggerInstance, (err, finalLogger, evt) => {
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

  return process.env.NODE_ENV === 'production' ? loggerInstance : pino(pino.extreme());
};

export const logger = createLogger();
