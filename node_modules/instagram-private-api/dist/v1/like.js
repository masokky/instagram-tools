"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("../core/request");
class Like {
    static async post(action = 'like', session, mediaId, moduleInfo = { moduleName: 'feed_timeline', d: false }) {
        return new request_1.Request(session)
            .setMethod('POST')
            .setResource(action, { id: mediaId })
            .generateUUID()
            .setData(Object.assign({ media_id: mediaId, _uid: await session.getAccountId(), radio_type: 'wifi-none' }, moduleInfo))
            .signPayload()
            .send();
    }
    static create(session, mediaId, moduleName) {
        return this.post('like', session, mediaId, moduleName);
    }
    static destroy(session, mediaId, moduleName) {
        return this.post('unlike', session, mediaId, moduleName);
    }
}
exports.Like = Like;
//# sourceMappingURL=like.js.map