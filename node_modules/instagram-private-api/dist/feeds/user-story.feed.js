"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
const media_response_1 = require("../responses/media.response");
const class_transformer_1 = require("class-transformer");
class UserStoryFeed {
    constructor(session, userIds) {
        this.session = session;
        this.userIds = userIds;
    }
    async get() {
        const data = await new core_1.Request(this.session)
            .setMethod('POST')
            .setResource('userStory')
            .generateUUID()
            .setData({
            user_ids: this.userIds.map(id => String(id)),
        })
            .signPayload()
            .send();
        return class_transformer_1.plainToClass(media_response_1.MediaResponse, data.reels);
    }
}
exports.UserStoryFeed = UserStoryFeed;
//# sourceMappingURL=user-story.feed.js.map