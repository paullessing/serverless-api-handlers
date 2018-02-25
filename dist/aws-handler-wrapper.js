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
var AwsHandlerWrapper = /** @class */ (function () {
    function AwsHandlerWrapper() {
    }
    AwsHandlerWrapper.prototype.wrap = function (handler) {
        var _this = this;
        return function (event, context, callback) {
            console.log('Handling request', event.headers);
            var request = _this.convertRequest(event);
            return Promise.resolve()
                .then(function () {
                return new Promise(function (resolve, reject) {
                    var done = function (response) {
                        resolve(response);
                    };
                    try {
                        var result = handler(request, done);
                        if (result && result.hasOwnProperty('then')) {
                            result.then(resolve, reject);
                        }
                        else {
                            resolve(result);
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
                    callback(null, result);
                }
                else if (result) {
                    callback(null, { statusCode: 200, body: JSON.stringify(result) });
                }
                else {
                    callback(null, { statusCode: 204 });
                }
            }).catch(function (e) {
                console.log('Failure', e);
                if (e.statusCode) {
                    callback(null, e);
                }
                else {
                    console.log('Unhandled exeption:', e);
                    callback(null, { statusCode: 500, body: JSON.stringify(e) });
                }
            });
        };
    };
    AwsHandlerWrapper.prototype.convertRequest = function (event) {
        var body = this.getBody(event.body, event.headers['Content-Type']);
        var request = {
            headers: __assign({}, event.headers),
            body: body,
            httpMethod: event.httpMethod,
            path: event.path,
            pathParameters: event.pathParameters || {},
            queryParameters: event.queryStringParameters || {}
        };
        return request;
    };
    AwsHandlerWrapper.prototype.getBody = function (bodyString, contentType) {
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
    };
    return AwsHandlerWrapper;
}());
exports.AwsHandlerWrapper = AwsHandlerWrapper;
