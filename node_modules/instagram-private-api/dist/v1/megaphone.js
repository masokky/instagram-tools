"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
const resource_1 = require("./resource");
const request_1 = require("../core/request");
class Megaphone extends resource_1.InstagramResource {
    static log(session, data) {
        return new request_1.Request(session)
            .setMethod('POST')
            .setResource('megaphoneLog')
            .generateUUID()
            .setData(_.extend(data, {
            uuid: session.device.md5,
        }));
    }
    static logSeenMainFeed(session) {
        return Megaphone.log(session, {
            action: 'seen',
            display_medium: 'main_feed',
            type: 'feed_aysf',
        });
    }
}
exports.Megaphone = Megaphone;
//# sourceMappingURL=megaphone.js.map