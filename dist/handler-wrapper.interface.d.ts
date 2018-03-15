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
export declare type RequestHandler = (request: HandlerRequest, done?: (response?: HandlerResponse) => void) => void | HandlerResponse | Promise<HandlerResponse>;
export interface HandlerResponse {
    statusCode: number;
    body?: string;
    headers?: {
        [key: string]: string;
    };
}
export interface HandlerConfig {
    cors?: string | boolean;
}
export interface HandlerWrapper<T = any> {
    wrap(handler: RequestHandler, config?: HandlerConfig): T;
}
