import { HandlerConfig, HandlerRequest, HandlerResponse, HandlerWrapper, RequestHandler } from './handler-wrapper.interface';
import { APIGatewayEvent, Context, Callback, APIGatewayProxyHandler } from 'aws-lambda';
import * as querystring from 'querystring';

export class AwsHandlerWrapper implements HandlerWrapper<APIGatewayProxyHandler> {
  public wrap(handler: RequestHandler, config: HandlerConfig = {}): APIGatewayProxyHandler {
    return (event: APIGatewayEvent, context: Context, callback: Callback) => {
      console.log('Handling request', event.headers);

      const complete = (data: HandlerResponse) => {
        const fullData = { ...data };
        if (config.cors) {
          fullData.headers = { ...fullData.headers, ...{
            'Access-Control-Allow-Origin': typeof config.cors === 'string' ? config.cors : '*'
          }};
        }

        callback(null, fullData);
      };

      const request = this.convertRequest(event);

      return new Promise<any>((resolve, reject) => {
        const done = (response?: HandlerResponse) => {
          resolve(response);
        };
        try {
          const result = handler(request, done);
          if (result && result.hasOwnProperty('then')) {
            (result as Promise<HandlerResponse>).then(resolve, reject);
          } else {
            resolve(result);
          }
        } catch (e) {
          reject(e);
        }
      })
        .then((result: HandlerResponse) => {
          console.log('Success', result);
          if (result && result.statusCode) {
            complete(result);
          } else if (result) {
            complete({ statusCode: 200, body: JSON.stringify(result) });
          } else {
            complete({ statusCode: 204 });
          }
        }).catch((e) => {
          console.log('Failure', e);
          if (e.statusCode) {
            complete(e);
          } else {
            console.log('Unhandled exeption:', e);
            complete({ statusCode: 500, body: JSON.stringify(e) });
          }
        });
    }
  }

  private convertRequest(event: APIGatewayEvent): HandlerRequest {
    const body = this.getBody(event.body, event.headers['Content-Type']);
    const request: HandlerRequest = {
      headers: { ...event.headers },
      body,
      httpMethod: event.httpMethod,
      path: event.path,
      pathParameters: event.pathParameters || {},
      queryParameters: event.queryStringParameters || {}
    };
    return request;
  }

  private getBody(bodyString: string | null, contentType: string | null): any {
    if (!contentType) {
      return bodyString;
    }
    if (!bodyString) {
      return null;
    }

    if (contentType.match(/^text\/plain/i)) {
      return '' + bodyString;
    }

    if (contentType.match(/^application\/x-www-form-urlencoded/i)) {
      return querystring.parse(bodyString);
    }

    if (contentType.match(/^application\/json/i)) {
      return JSON.parse(bodyString);
    }

    throw new Error('Unexpected content type ' + contentType);
  }
}
