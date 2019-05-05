declare module 'types/utils' {
  import {Request, RequestHandler, Response, NextFunction, Express} from 'express';
  import {Db} from 'mongodb';

  interface CustomRequest extends Request {
    id: string;
  }

  type CustomRequestHandler = (req: CustomRequest, res: Response, next: NextFunction) => any;

  type RouteController = (app: Express) => void;

  type ErrorProps = {
    code?: number;
    message?: string;
    data: {[k: string]: any};
  };

  interface ExtendedError {
    code?: number;
    data: {[k: string]: any};
  }

  type MongoObjectID = string;

  type ThenArg<T> = T extends Promise<infer U> ? U : T;

  // type RepositoryMapper<T> = (connection: Db) => {[k in keyof T]: <A, R>(args: A) => Promise<R>};
}
