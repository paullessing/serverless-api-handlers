export interface HandlerRequest<B = any> {
    headers: {
        [name: string]: string;
    };
    body?: B;
    httpMethod: string;
    path: string;
    pathParameters: {
        [p: string]: string;
    };
    queryParameters: {
        [p: string]: string | string[];
    };
}
export declare type RequestHandler = (request: HandlerRequest, done: (response?: HandlerResponse) => void) => void | HandlerResponse | Promise<HandlerResponse>;
export interface HandlerResponse {
    statusCode: number;
    body?: string;
}
export interface HandlerWrapper<T> {
    wrap(handler: RequestHandler): T;
}
