"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const user_response_1 = require("../responses/user.response");
const request_1 = require("../core/request");
const helpers_1 = require("../helpers");
const hashtag_1 = require("./hashtag");
const location_1 = require("./location");
exports.search = (session, query) => session
    .getAccountId()
    .then(id => new request_1.Request(session)
    .setMethod('GET')
    .setResource('topSearch', {
    rankToken: helpers_1.Helpers.buildRankToken(id).toUpperCase(),
    query,
})
    .send())
    .then(json => {
    const users = json.users.map(user => ({
        user: class_transformer_1.plainToClass(user_response_1.UserResponse, user.user),
        position: user.position,
    }));
    const places = json.places.map(place => ({
        place: new location_1.Location(session, place.place),
        position: place.position,
    }));
    const hashtags = json.hashtags.map(hashtag => ({
        hashtag: new hashtag_1.Hashtag(session, hashtag.hashtag),
        position: hashtag.position,
    }));
    return {
        users,
        places,
        hashtags,
    };
});
//# sourceMappingURL=search.js.map