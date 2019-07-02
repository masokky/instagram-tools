"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXPERIMENTS = require("./experiments.json");
exports.LOGIN_EXPERIMENTS = require("./login-experiments.json");
exports.SUPPORTED_CAPABILITIES = require("./supported-capabilities.json");
exports.APP_CREDENTIALS = {
    SIG_KEY: '19ce5f445dbfd9d29c59dc2a78c616a7fc090a8e018b9267bc4240a30244c53b',
    SIG_VERSION: '4',
    VERSION: '76.0.0.15.395',
    VERSION_CODE: '138226743',
    FB_ANALYTICS_APPLICATION_ID: '567067343352427',
    LANGUAGE: 'en_US',
};
exports.TLD = 'instagram.com';
exports.HOSTNAME = 'i.instagram.com';
exports.WEB_HOSTNAME = 'www.instagram.com';
exports.HOST = `https://${exports.HOSTNAME}/`;
exports.WEBHOST = `https://${exports.WEB_HOSTNAME}/`;
exports.API_ENDPOINT = `${exports.HOST}api/v1/`;
exports.HEADERS = {
    X_IG_Connection_Type: 'WIFI',
    X_IG_Capabilities: '3brTPw==',
};
//# sourceMappingURL=constants.js.map