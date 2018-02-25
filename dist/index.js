"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aws_handler_wrapper_1 = require("./aws-handler-wrapper");
var gcloud_handler_wrapper_1 = require("./gcloud-handler-wrapper");
exports.aws = new aws_handler_wrapper_1.AwsHandlerWrapper();
exports.gcloud = new gcloud_handler_wrapper_1.GcloudHandlerWrapper();
