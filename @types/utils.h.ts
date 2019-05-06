declare module 'types/utils' {
  import {LanguageType} from 'types/User.model';
  import {Request, RequestHandler, Response, NextFunction, Express} from 'express';
  import {Db, ObjectId} from 'mongodb';

  interface CustomRequest extends Request {
    id: string;
    auth: {
      userId: ObjectId;
      language: LanguageType;
    };
  }

  type CustomRequestHandler = (req: CustomRequest, res: Response, next: NextFunction) => any;

  type RouteController = (app: Express) => void;

  type ErrorProps = {
    code?: number;
    message?: string;
    data?: {[k: string]: any};
    log?: Error;
  };

  interface ExtendedError {
    code?: number;
    data: {[k: string]: any};
  }

  type MongoObjectID = string;

  type ThenArg<T> = T extends Promise<infer U> ? U : T;

  // type RepositoryMapper<T> = (connection: Db) => {[k in keyof T]: <A, R>(args: A) => Promise<R>};
}
