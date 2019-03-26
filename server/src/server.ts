import express from 'express';
import cors from 'cors';
import path from 'path';
import pinoLogger from 'express-pino-logger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import {uniqueRequestId} from '@src/middlewares/requestId';

const app = express();

app.use(uniqueRequestId);
app.use(helmet());
app.use(pinoLogger());
app.use(cors({maxAge: 1728000}));
app.use(express.urlencoded({extended: true}));
app.use(express.json({limit: '1mb'}));
app.use(cookieParser());

app.set('json spaces', 4);

export {app};
