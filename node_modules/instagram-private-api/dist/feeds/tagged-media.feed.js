"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const class_transformer_1 = require("class-transformer");
const abstract_feed_1 = require("./abstract.feed");
const media_response_1 = require("../responses/media.response");
const request_1 = require("../core/request");
const exceptions_1 = require("../core/exceptions");
class TaggedMediaFeed extends abstract_feed_1.AbstractFeed {
    constructor(session, tag, limit = Infinity) {
        super(session);
        this.tag = tag;
        this.limit = limit;
    }
    async getRawResponse() {
        const data = await new request_1.Request(this.session)
            .setMethod('GET')
            .setResource('tagFeed', {
            tag: this.tag,
            maxId: this.getCursor(),
            rankToken: this.rankToken,
        })
            .send();
        this.moreAvailable = data.more_available && !!data.next_max_id;
        if (this.moreAvailable)
            this.setCursor(data.next_max_id);
        return data;
    }
    async get() {
        const data = await this.getRawResponse();
        if (!this.moreAvailable && !_.isEmpty(data.ranked_items) && !this.getCursor())
            throw new exceptions_1.OnlyRankedItemsError();
        return class_transformer_1.plainToClass(media_response_1.MediaResponse, data.items);
    }
    async getRankedItems() {
        const data = await this.getRawResponse();
        return class_transformer_1.plainToClass(media_response_1.MediaResponse, data.ranked_items);
    }
}
exports.TaggedMediaFeed = TaggedMediaFeed;
//# sourceMappingURL=tagged-media.feed.js.map