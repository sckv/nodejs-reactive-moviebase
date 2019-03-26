import {Request, RequestHandler, Response, NextFunction} from 'express';

export type CustomRequest = Request & {
  id: string;
};

export type CustomRequestHandler = {
  (req: CustomRequest, res: Response, next: NextFunction): any;
};
