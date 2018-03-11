"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var querystring = require("querystring");
var GcloudHandlerWrapper = /** @class */ (function () {
    function GcloudHandlerWrapper() {
    }
    GcloudHandlerWrapper.prototype.wrap = function (handler, config) {
        var _this = this;
        if (config === void 0) { config = {}; }
        return function (req, response) {
            var request = _this.convertRequest(req);
            if (config.cors) {
                response.setHeader('Access-Control-Allow-Origin', typeof config.cors === 'string' ? config.cors : '*');
            }
            return Promise.resolve()
                .then(function () {
                return new Promise(function (resolve, reject) {
                    var done = function (response) {
                        resolve(response);
                    };
                    try {
                        var result = handler(request, done);
                        if (result) {
                            if (result.hasOwnProperty('then')) {
                                result.then(resolve, reject);
                            }
                            else {
                                resolve(result);
                            }
                        }
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            })
                .then(function (result) {
                console.log('Success', result);
                if (result && result.statusCode) {
                    response.status(result.statusCode);
                    if (result.headers) {
                        _this.sendHeaders(response, result.headers);
                    }
                    response.send(result.body).end();
                }
                else if (result) {
                    response.status(200).send(JSON.stringify(result)).end();
                }
                else {
                    response.status(204).end();
                }
            }).catch(function (e) {
                console.log('Failure', e);
                if (e.statusCode) {
                    response.status(e.statusCode);
                    if (e.headers) {
                        _this.sendHeaders(response, e.headers);
                    }
                    response.send(e.body).end();
                }
                else {
                    console.log('Unhandled exeption:', e);
                    response.status(500).send(JSON.stringify(e)).end();
                }
            });
        };
    };
    GcloudHandlerWrapper.prototype.convertRequest = function (request) {
        var body = request.body;
        var headers = __assign({}, request.headers);
        var internalRequest = {
            httpMethod: request.method,
            body: body,
            headers: headers,
            path: request.path,
            pathParameters: {},
            queryParameters: querystring.parse(request.query) || {}
        };
        return internalRequest;
    };
    GcloudHandlerWrapper.prototype.sendHeaders = function (response, headers) {
        Object.keys(headers).forEach(function (header) {
            response.setHeader(header, headers[header]);
        });
    };
    return GcloudHandlerWrapper;
}());
exports.GcloudHandlerWrapper = GcloudHandlerWrapper;
