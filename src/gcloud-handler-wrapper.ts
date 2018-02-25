import { HandlerWrapper, HandlerRequest, RequestHandler, HandlerResponse } from './handler-wrapper.interface';
import { Request, RequestHandler as ExpressRequestHandler, Response } from 'express';
import * as querystring from 'querystring';

export class GcloudHandlerWrapper implements HandlerWrapper<ExpressRequestHandler> {
  public wrap(handler: RequestHandler) {
    return (req: Request, response: Response) => {
      const request = this.convertRequest(req);

      return Promise.resolve()
        .then((): Promise<HandlerResponse> => {
          return new Promise((resolve, reject) => {
            const done = (response?: HandlerResponse) => {
              resolve(response);
            };
            try {
              const result = handler(request, done);
              if (result) {
                if (result.hasOwnProperty('then')) {
                  (result as Promise<HandlerResponse>).then(resolve, reject);
                } else {
                  resolve(result);
                }
              }
            } catch (e) {
              reject(e);
            }
          });
        })
        .then((result: HandlerResponse) => {
          console.log('Success', result);
          if (result && result.statusCode) {
            response.status(result.statusCode).send(result.body).end();
          } else if (result) {
            response.status(200).send(JSON.stringify(result)).end();
          } else {
            response.status(204).end();
          }
        }).catch((e) => {
          console.log('Failure', e);
          if (e.statusCode) {
            response.status(e.statusCode).send(e.body).end();
          } else {
            console.log('Unhandled exeption:', e);
            response.status(500).send(JSON.stringify(e)).end();
          }
        });
    };
  }

  private convertRequest(request: Request): HandlerRequest {
    const body = request.body;
    const headers = { ...request.headers } as { [name: string]: string };

    const internalRequest: HandlerRequest = {
      httpMethod: request.method,
      body,
      headers,
      path: request.path,
      pathParameters: {},
      queryParameters: querystring.parse(request.query) || {}
    };

    return internalRequest;
  }

}
