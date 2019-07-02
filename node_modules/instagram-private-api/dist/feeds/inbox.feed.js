"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
const abstract_feed_1 = require("./abstract.feed");
const thread_1 = require("../v1/thread");
class InboxFeed extends abstract_feed_1.AbstractFeed {
    constructor(session, limit = Infinity) {
        super(session);
        this.limit = limit;
    }
    getPendingRequestsTotal() {
        return this.pendingRequestsTotal;
    }
    async get() {
        const json = await new core_1.Request(this.session)
            .setMethod('GET')
            .setResource('inbox', {
            cursor: this.getCursor(),
        })
            .send();
        this.moreAvailable = json.inbox.has_older;
        this.pendingRequestsTotal = json.pending_requests_total;
        if (this.moreAvailable)
            this.setCursor(json.inbox.oldest_cursor.toString());
        return json.inbox.threads.map(thread => new thread_1.Thread(this.session, thread));
    }
}
exports.InboxFeed = InboxFeed;
//# sourceMappingURL=inbox.feed.js.map