"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const user_response_1 = require("../responses/user.response");
const request_1 = require("../core/request");
const abstract_feed_1 = require("./abstract.feed");
class AccountFollowingFeed extends abstract_feed_1.AbstractFeed {
    constructor(session, accountId, limit = Infinity) {
        super(session);
        this.accountId = accountId;
        this.limit = limit;
    }
    async get() {
        const data = await new request_1.Request(this.session)
            .setMethod('GET')
            .setResource('followingFeed', {
            id: this.accountId,
            maxId: this.getCursor(),
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
exports.AccountFollowingFeed = AccountFollowingFeed;
//# sourceMappingURL=account-following.feed.js.map