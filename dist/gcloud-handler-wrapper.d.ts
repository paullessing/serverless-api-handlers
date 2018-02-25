/// <reference types="express" />
import { HandlerWrapper, RequestHandler } from './handler-wrapper.interface';
import { Request, RequestHandler as ExpressRequestHandler, Response } from 'express';
export declare class GcloudHandlerWrapper implements HandlerWrapper<ExpressRequestHandler> {
    wrap(handler: RequestHandler): (req: Request, response: Response) => Promise<void>;
    private convertRequest(request);
}
