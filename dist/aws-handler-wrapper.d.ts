import { HandlerConfig, HandlerWrapper, RequestHandler } from './handler-wrapper.interface';
import { APIGatewayProxyHandler } from 'aws-lambda';
export declare class AwsHandlerWrapper implements HandlerWrapper<APIGatewayProxyHandler> {
    wrap(handler: RequestHandler, config?: HandlerConfig): APIGatewayProxyHandler;
    private convertRequest(event);
    private getBody(bodyString, contentType);
}
