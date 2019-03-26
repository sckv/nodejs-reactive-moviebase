import express, {Request, RequestHandler, Response, NextFunction} from 'express';

export type CustomRequest = Request & {
  id: string;
};

export interface CustomRequestHandler {
  (req: CustomRequest, res: Response, next: NextFunction): any;
}

export type RouteController = (app: ReturnType<typeof express>) => void;
