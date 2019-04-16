declare module 'types/utils' {
  import {Request, RequestHandler, Response, NextFunction, Express} from 'express';

  interface CustomRequest extends Request {
    id: string;
  }

  type CustomRequestHandler = (req: CustomRequest, res: Response, next: NextFunction) => any;

  type RouteController = (app: Express) => void;

  type ErrorProps = {
    code?: number;
    message: string;
  };
}
