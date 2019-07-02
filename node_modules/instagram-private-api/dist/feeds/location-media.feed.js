"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const class_transformer_1 = require("class-transformer");
const abstract_feed_1 = require("./abstract.feed");
const request_1 = require("../core/request");
const exceptions_1 = require("../core/exceptions");
const media_response_1 = require("../responses/media.response");
class LocationMediaFeed extends abstract_feed_1.AbstractFeed {
    constructor(session, locationId, limit = Infinity) {
        super(session);
        this.locationId = locationId;
        this.limit = limit;
    }
    async get() {
        const data = await new request_1.Request(this.session)
            .setMethod('GET')
            .setResource('locationFeed', {
            id: this.locationId,
            maxId: this.getCursor(),
            rankToken: this.rankToken,
        })
            .send()
            .catch(exceptions_1.ParseError, () => {
            throw new exceptions_1.PlaceNotFound();
        });
        this.moreAvailable = data.more_available && !!data.next_max_id;
        if (!this.moreAvailable && !_.isEmpty(data.ranked_items) && !this.getCursor())
            throw new exceptions_1.OnlyRankedItemsError();
        if (this.moreAvailable)
            this.setCursor(data.next_max_id);
        return class_transformer_1.plainToClass(media_response_1.MediaResponse, data.items);
    }
}
exports.LocationMediaFeed = LocationMediaFeed;
//# sourceMappingURL=location-media.feed.js.map