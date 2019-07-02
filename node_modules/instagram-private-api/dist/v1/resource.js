"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require('events').EventEmitter;
const _ = require('lodash');
const request_1 = require("../core/request");
const session_1 = require("../core/session");
class InstagramResource extends EventEmitter {
    constructor(session, params) {
        super();
        if (!(session instanceof session_1.Session))
            throw new Error('Argument `session` is not instace of Session');
        this._session = session;
        this._params = {};
        this.setParams(_.isObject(params) ? params : {});
    }
    get params() {
        return this.getParams();
    }
    get session() {
        return this._session;
    }
    parseParams(params) {
        return params;
    }
    setParams(params) {
        if (!_.isObject(params))
            throw new Error('Method `setParams` must have valid argument');
        params = this.parseParams(params);
        if (!_.isObject(params))
            throw new Error('Method `parseParams` must return object');
        this._params = params;
        if (params.id)
            this.id = params.id;
        return this;
    }
    getParams() {
        return this._params;
    }
    request() {
        return new request_1.Request(this._session);
    }
}
exports.InstagramResource = InstagramResource;
//# sourceMappingURL=resource.js.map