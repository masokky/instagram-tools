"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const abstract_feed_1 = require("./abstract.feed");
const core_1 = require("../core");
const media_response_1 = require("../responses/media.response");
class SelfLikedFeed extends abstract_feed_1.AbstractFeed {
    constructor(session, limit) {
        super(session);
        this.limit = limit;
        this.limit = parseInt(limit) || null;
    }
    async get() {
        const data = await new core_1.Request(this.session)
            .setMethod('GET')
            .setResource('selfLikedFeed', {
            maxId: this.getCursor(),
        })
            .send();
        const nextMaxId = data.next_max_id ? data.next_max_id.toString() : data.next_max_id;
        this.moreAvailable = data.more_available && !!nextMaxId;
        if (this.moreAvailable)
            this.setCursor(nextMaxId);
        return class_transformer_1.plainToClass(media_response_1.MediaResponse, data.items);
    }
}
exports.SelfLikedFeed = SelfLikedFeed;
//# sourceMappingURL=self-liked.feed.js.map