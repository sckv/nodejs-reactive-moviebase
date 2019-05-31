import express from 'express';
import cors from 'cors';
// import path from 'path';
import pinoLogger from 'express-pino-logger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { uniqueRequestId } from '@src/middlewares/request-id';
import { errorsHandler } from '@src/middlewares/error-handler';
import { session } from '@src/middlewares/session';

const api = express();

api.use(
  cors({
    maxAge: 1728000,
    credentials: true,
    exposedHeaders: ['x-request-id'],
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
  }),
);

api.use(cookieParser());
api.use(uniqueRequestId);
api.use(pinoLogger());

api.use(session);

api.use(helmet());
api.use(express.urlencoded({ extended: true }));
api.use(express.json({ limit: '1mb' }));
api.use(errorsHandler);

api.set('json spaces', 4);

export { api };
