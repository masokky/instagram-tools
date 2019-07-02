"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("../core/request");
const class_transformer_1 = require("class-transformer");
const user_response_1 = require("../responses/user.response");
const abstract_feed_1 = require("./abstract.feed");
class AccountFollowersFeed extends abstract_feed_1.AbstractFeed {
    constructor(session, accountId, limit = Infinity) {
        super(session);
        this.accountId = accountId;
        this.limit = limit;
    }
    async get() {
        const data = await new request_1.Request(this.session)
            .setMethod('GET')
            .setResource('followersFeed', {
            id: this.accountId,
            maxId: this.cursor,
            rankToken: this.rankToken,
        })
            .send();
        this.moreAvailable = !!data.next_max_id;
        if (this.moreAvailable) {
            this.setCursor(data.next_max_id);
        }
        return class_transformer_1.plainToClass(user_response_1.UserResponse, data.users);
    }
}
exports.AccountFollowersFeed = AccountFollowersFeed;
//# sourceMappingURL=account-followers.feed.js.map