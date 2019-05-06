import express from 'express';
import cors from 'cors';
// import path from 'path';
import pinoLogger from 'express-pino-logger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import {uniqueRequestId} from '@src/middlewares/request-id';

const api = express();

api.use(uniqueRequestId);
api.use(helmet());
api.use(pinoLogger());
api.use(cors({maxAge: 1728000}));
api.use(express.urlencoded({extended: true}));
api.use(express.json({limit: '1mb'}));
api.use(cookieParser());

api.set('json spaces', 4);

export {api};
