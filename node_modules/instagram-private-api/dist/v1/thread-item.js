"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const camelKeys = require("camelcase-keys");
const class_transformer_1 = require("class-transformer");
const responses_1 = require("../responses");
const resource_1 = require("./resource");
const media_1 = require("./media");
const location_1 = require("./location");
const link_1 = require("./link");
const placeholder_1 = require("./placeholder");
const hashtag_1 = require("./hashtag");
class ThreadItem extends resource_1.InstagramResource {
    parseParams(json) {
        const hash = camelKeys(json);
        hash.id = json.item_id || json.id;
        hash.type = json.item_type;
        if (hash.type === 'link') {
            hash.link = 'link';
            this.link = new link_1.Link(this.session, json.link);
        }
        if (hash.type === 'placeholder') {
            hash.placeholder = 'placeholder';
            this.placeholder = new placeholder_1.Placeholder(this.session, json.placeholder);
        }
        if (hash.type === 'text') {
            hash.text = json.text;
        }
        if (hash.type === 'media') {
            hash.media = json.media.image_versions2.candidates;
        }
        if (hash.type === 'media_share') {
            hash.type = 'mediaShare';
            this.mediaShare = new media_1.Media(this.session, json.media_share);
        }
        if (hash.type === 'action_log') {
            hash.type = 'actionLog';
            hash.actionLog = json.action_log;
        }
        if (hash.type === 'profile') {
            this.profile = class_transformer_1.plainToClass(responses_1.UserResponse, json.profile);
            hash.profileMediaPreview = _.map(json.preview_medias || [], medium => ({
                id: medium.id.toString(),
                images: medium.image_versions2.candidates,
            }));
        }
        if (hash.type === 'location') {
            const location = json.location;
            location.location = Object.create(json.location);
            location.title = location.name;
            location.subtitle = null;
            this.location = new location_1.Location(this.session, location);
        }
        if (hash.type === 'hashtag') {
            this.hashtag = new hashtag_1.Hashtag(this.session, json.hashtag);
        }
        hash.accountId = json.user_id;
        hash.created = parseInt(`${json.timestamp / 1000}`);
        return hash;
    }
    getParams() {
        const params = _.clone(this._params);
        if (params.type === 'link')
            params.link = this.link.params;
        if (params.type === 'placeholder')
            params.placeholder = this.placeholder.params;
        if (params.type === 'mediaShare')
            params.mediaShare = this.mediaShare.params;
        if (params.type === 'profile')
            params.profile = this.profile.params;
        if (params.type === 'location')
            params.location = this.location.params;
        if (params.type === 'hashtag')
            params.hashtag = this.hashtag.params;
        return params;
    }
}
exports.ThreadItem = ThreadItem;
//# sourceMappingURL=thread-item.js.map