"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const media_response_1 = require("../responses/media.response");
const class_transformer_1 = require("class-transformer");
const core_1 = require("../core");
const abstract_feed_1 = require("./abstract.feed");
class UserMediaFeed extends abstract_feed_1.AbstractFeed {
    constructor(session, accountId, limit = Infinity) {
        super(session);
        this.accountId = accountId;
        this.limit = limit;
    }
    async get() {
        const data = await new core_1.Request(this.session)
            .setMethod('GET')
            .setResource('userFeed', {
            id: this.accountId,
            maxId: this.getCursor(),
        })
            .send();
        this.moreAvailable = data.more_available && !!data.next_max_id;
        if (this.moreAvailable) {
            this.setCursor(data.next_max_id);
        }
        return class_transformer_1.plainToClass(media_response_1.MediaResponse, data.items);
    }
}
exports.UserMediaFeed = UserMediaFeed;
//# sourceMappingURL=user-media.feed.js.map