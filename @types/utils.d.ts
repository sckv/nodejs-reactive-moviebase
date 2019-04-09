declare module 'types/utils' {
  import express, {Request, RequestHandler, Response, NextFunction} from 'express';

  type CustomRequest = Request & {
    id: string;
  };

  type CustomRequestHandler = (req: CustomRequest, res: Response, next: NextFunction) => any;

  type RouteController = (app: ReturnType<typeof express>) => void;
}
