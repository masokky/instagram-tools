"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_feed_1 = require("./abstract.feed");
const request_1 = require("../core/request");
const class_transformer_1 = require("class-transformer");
const user_response_1 = require("../responses/user.response");
class StoryViewersFeed extends abstract_feed_1.AbstractFeed {
    constructor(session, mediaId) {
        super(session);
        this.mediaId = mediaId;
    }
    async get() {
        const data = await new request_1.Request(this.session)
            .setMethod('GET')
            .setResource('storyViewers', {
            mediaId: this.mediaId,
            maxId: this.getCursor(),
        })
            .send();
        const nextMaxId = data.next_max_id ? data.next_max_id.toString() : data.next_max_id;
        this.moreAvailable = !!nextMaxId;
        if (this.moreAvailable)
            this.setCursor(nextMaxId);
        return class_transformer_1.plainToClass(user_response_1.UserResponse, data.users);
    }
}
exports.StoryViewersFeed = StoryViewersFeed;
//# sourceMappingURL=story-viewers.feed.js.map