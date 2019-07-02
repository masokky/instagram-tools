"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_feed_1 = require("./abstract.feed");
const request_1 = require("../core/request");
const thread_item_1 = require("../v1/thread-item");
class ThreadItemsFeed extends abstract_feed_1.AbstractFeed {
    constructor(session, threadId, limit) {
        super(session);
        this.threadId = threadId;
        this.limit = parseInt(limit) || null;
    }
    get() {
        return new request_1.Request(this.session)
            .setMethod('GET')
            .setResource('threadsShow', {
            cursor: this.getCursor(),
            threadId: this.threadId,
        })
            .send()
            .then(json => {
            const items = json.thread.items.map(item => new thread_item_1.ThreadItem(this.session, item));
            this.moreAvailable = json.thread.has_older;
            if (this.isMoreAvailable())
                this.setCursor(json.thread.oldest_cursor);
            return items;
        });
    }
}
exports.ThreadItemsFeed = ThreadItemsFeed;
//# sourceMappingURL=thread-items.feed.js.map