"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const abstract_feed_1 = require("./abstract.feed");
const media_response_1 = require("../responses/media.response");
const request_1 = require("../core/request");
class SavedMediaFeed extends abstract_feed_1.AbstractFeed {
    constructor(session, limit) {
        super(session);
        this.limit = limit;
    }
    async get() {
        const data = await new request_1.Request(this.session)
            .setMethod('POST')
            .setResource('savedFeed', {
            maxId: this.cursor,
        })
            .generateUUID()
            .setData({})
            .signPayload()
            .send();
        this.moreAvailable = data.more_available;
        if (this.moreAvailable && data.next_max_id) {
            this.setCursor(data.next_max_id);
        }
        return class_transformer_1.plainToClass(media_response_1.MediaResponse, data.items.map(i => i.media));
    }
}
exports.SavedMediaFeed = SavedMediaFeed;
//# sourceMappingURL=saved-media.feed.js.map