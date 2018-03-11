/// <reference types="express" />
import { HandlerWrapper, RequestHandler, HandlerConfig } from './handler-wrapper.interface';
import { Request, RequestHandler as ExpressRequestHandler, Response } from 'express';
export declare class GcloudHandlerWrapper implements HandlerWrapper<ExpressRequestHandler> {
    wrap(handler: RequestHandler, config?: HandlerConfig): (req: Request, response: Response) => Promise<void>;
    private convertRequest(request);
    private sendHeaders(response, headers);
}
