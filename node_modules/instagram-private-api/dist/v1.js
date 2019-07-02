"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONSTANTS = require("./constants/constants");
const routes = require("./core/routes");
const device_1 = require("./core/devices/device");
const cookie_storage_1 = require("./core/cookies/cookie-storage");
const cookie_file_storage_1 = require("./core/cookies/cookie-file-storage");
const cookie_memory_storage_1 = require("./core/cookies/cookie-memory-storage");
const Exceptions = require("./core/exceptions");
const json_pruned_1 = require("./v1/json-pruned");
const resource_1 = require("./v1/resource");
const request_1 = require("./core/request");
const session_1 = require("./core/session");
const account_1 = require("./v1/account");
const media_1 = require("./v1/media");
const like_1 = require("./v1/like");
const comment_1 = require("./v1/comment");
const hashtag_1 = require("./v1/hashtag");
const link_1 = require("./v1/link");
const placeholder_1 = require("./v1/placeholder");
const location_1 = require("./v1/location");
const relationship_1 = require("./v1/relationship");
const thread_1 = require("./v1/thread");
const thread_item_1 = require("./v1/thread-item");
const qe_1 = require("./v1/qe");
const internal_1 = require("./v1/internal");
const upload_1 = require("./v1/upload");
const discover_1 = require("./v1/discover");
const save_1 = require("./v1/save");
const search_1 = require("./v1/search");
const account_creator_1 = require("./v1/account-creator");
const account_followers_feed_1 = require("./feeds/account-followers.feed");
const account_following_feed_1 = require("./feeds/account-following.feed");
const inbox_feed_1 = require("./feeds/inbox.feed");
const inbox_pending_feed_1 = require("./feeds/inbox-pending.feed");
const location_media_feed_1 = require("./feeds/location-media.feed");
const tagged_media_feed_1 = require("./feeds/tagged-media.feed");
const thread_items_feed_1 = require("./feeds/thread-items.feed");
const timeline_feed_1 = require("./feeds/timeline.feed");
const user_media_feed_1 = require("./feeds/user-media.feed");
const self_liked_feed_1 = require("./feeds/self-liked.feed");
const media_comments_feed_1 = require("./feeds/media-comments.feed");
const saved_media_feed_1 = require("./feeds/saved-media.feed");
const story_tray_feed_1 = require("./feeds/story-tray.feed");
const user_story_feed_1 = require("./feeds/user-story.feed");
const story_viewers_feed_1 = require("./feeds/story-viewers.feed");
const web_request_1 = require("./core/web-request");
const challenge_1 = require("./v1/challenge");
const Feed = {
    AccountFollowers: account_followers_feed_1.AccountFollowersFeed,
    AccountFollowing: account_following_feed_1.AccountFollowingFeed,
    Inbox: inbox_feed_1.InboxFeed,
    InboxPending: inbox_pending_feed_1.InboxPendingFeed,
    LocationMedia: location_media_feed_1.LocationMediaFeed,
    TaggedMedia: tagged_media_feed_1.TaggedMediaFeed,
    ThreadItems: thread_items_feed_1.ThreadItemsFeed,
    Timeline: timeline_feed_1.TimelineFeed,
    UserMedia: user_media_feed_1.UserMediaFeed,
    SelfLiked: self_liked_feed_1.SelfLikedFeed,
    MediaComments: media_comments_feed_1.MediaCommentsFeed,
    SavedMedia: saved_media_feed_1.SavedMediaFeed,
    TagMedia: tagged_media_feed_1.TaggedMediaFeed,
    StoryTrayFeed: story_tray_feed_1.StoryTrayFeed,
    UserStoryFeed: user_story_feed_1.UserStoryFeed,
    StoryViewersFeed: story_viewers_feed_1.StoryViewersFeed,
};
const Web = {
    Request: web_request_1.WebRequest,
    Challenge: challenge_1.Challenge,
    NotImplementedChallenge: challenge_1.NotImplementedChallenge,
    EmailVerificationChallenge: challenge_1.EmailVerificationChallenge,
    PhoneVerificationChallenge: challenge_1.PhoneVerificationChallenge,
};
const InstagramV1 = {
    CONSTANTS,
    routes,
    Device: device_1.Device,
    CookieStorage: cookie_storage_1.CookieStorage,
    CookieFileStorage: cookie_file_storage_1.CookieFileStorage,
    CookieMemoryStorage: cookie_memory_storage_1.CookieMemoryStorage,
    Exceptions,
    prunedJson: json_pruned_1.pruned,
    Resource: resource_1.InstagramResource,
    Request: request_1.Request,
    Session: session_1.Session,
    Account: account_1.Account,
    Media: media_1.Media,
    Like: like_1.Like,
    Comment: comment_1.Comment,
    Hashtag: hashtag_1.Hashtag,
    Link: link_1.Link,
    Placeholder: placeholder_1.Placeholder,
    Location: location_1.Location,
    Relationship: relationship_1.Relationship,
    Thread: thread_1.Thread,
    ThreadItem: thread_item_1.ThreadItem,
    QE: qe_1.QE,
    Internal: internal_1.Internal,
    Upload: upload_1.Upload,
    discover: discover_1.discover,
    Save: save_1.Save,
    search: search_1.search,
    AccountCreator: account_creator_1.AccountCreator,
    AccountPhoneCreator: account_creator_1.AccountPhoneCreator,
    AccountEmailCreator: account_creator_1.AccountEmailCreator,
    Feed,
    Web,
};
exports.default = InstagramV1;
//# sourceMappingURL=v1.js.map