"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants/constants");
const story_tray_response_1 = require("../responses/story-tray.response");
const class_transformer_1 = require("class-transformer");
const request_1 = require("../core/request");
class StoryTrayFeed {
    constructor(session) {
        this.session = session;
    }
    async get() {
        const { tray } = await new request_1.Request(this.session)
            .setMethod('POST')
            .setResource('storyTray')
            .setBodyType('form')
            .setData({})
            .setData({
            _uuid: this.session.uuid,
            _csrftoken: this.session.CSRFToken,
            supported_capabilities_new: JSON.stringify(constants_1.SUPPORTED_CAPABILITIES),
        })
            .send();
        return class_transformer_1.plainToClass(story_tray_response_1.StoryTrayResponse, tray);
    }
}
exports.StoryTrayFeed = StoryTrayFeed;
//# sourceMappingURL=story-tray.feed.js.map