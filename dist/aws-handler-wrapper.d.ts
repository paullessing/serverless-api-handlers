import { HandlerWrapper, RequestHandler } from './handler-wrapper.interface';
import { APIGatewayProxyHandler } from 'aws-lambda';
export declare class AwsHandlerWrapper implements HandlerWrapper<APIGatewayProxyHandler> {
    wrap(handler: RequestHandler): APIGatewayProxyHandler;
    private convertRequest(event);
    private getBody(bodyString, contentType);
}
