"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resource_1 = require("./resource");
const request_1 = require("../core/request");
class Save extends resource_1.InstagramResource {
    static create(session, mediaId) {
        return new request_1.Request(session)
            .setMethod('POST')
            .setResource('save', { id: mediaId })
            .generateUUID()
            .setData({
            media_id: mediaId,
            src: 'profile',
        })
            .signPayload()
            .send()
            .then(data => new Save(session, {}));
    }
    static destroy(session, mediaId) {
        return new request_1.Request(session)
            .setMethod('POST')
            .setResource('unsave', { id: mediaId })
            .generateUUID()
            .setData({
            media_id: mediaId,
            src: 'profile',
        })
            .signPayload()
            .send()
            .then(data => new Save(session, {}));
    }
    parseParams(json) {
        return json || {};
    }
}
exports.Save = Save;
//# sourceMappingURL=save.js.map