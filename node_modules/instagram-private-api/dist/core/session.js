"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const _ = require("lodash");
const Chance = require("chance");
const CONSTANTS = require("../constants/constants");
const helpers_1 = require("../helpers");
const Bluebird = require("bluebird");
const internal_1 = require("../v1/internal");
const feeds_1 = require("../feeds");
const request_1 = require("./request");
const account_1 = require("../v1/account");
const relationship_1 = require("../v1/relationship");
const cookies_1 = require("./cookies");
const tough_cookie_1 = require("tough-cookie");
const exceptions_1 = require("./exceptions");
class Session {
    constructor(device, cookieStore = new cookies_1.CookieMemoryStorage(), proxy = null) {
        this.device = device;
        this.cookieStore = cookieStore;
        this.requestEnd$ = new rxjs_1.Subject();
        this.checkpoint$ = new rxjs_1.Subject();
        this.challenge$ = new rxjs_1.Subject();
        this.loginAttemptCount = 0;
        this.jar = request_1.Request.jar(cookieStore.store);
        this.proxyUrl = proxy;
    }
    get proxyUrl() {
        return this._proxyUrl;
    }
    set proxyUrl(val) {
        if (!helpers_1.Helpers.isValidUrl(val) && val !== null)
            throw new Error('`proxyUrl` argument is not an valid url');
        this._proxyUrl = val;
    }
    get session_id() {
        const chance = new Chance(`${this.device.username}${Math.round(Date.now() / 3600000)}`);
        return chance.guid();
    }
    get uuid() {
        return this.device.uuid;
    }
    get phone_id() {
        return this.device.phoneId;
    }
    get device_id() {
        return this.device.id;
    }
    get advertising_id() {
        return this.device.adid;
    }
    get CSRFToken() {
        const cookies = this.jar.getCookies(CONSTANTS.HOST);
        const item = _.find(cookies, { key: 'csrftoken' });
        return item ? item.value : 'missing';
    }
    static create(device, storage, username, password, proxy) {
        const session = new Session(device, storage);
        if (!_.isEmpty(proxy))
            session.proxyUrl = proxy;
        return (session
            .getAccountId()
            .then(() => session)
            .catch(exceptions_1.CookieNotValidError, () => Session.login(session, username, password)));
    }
    static login(session, username, password) {
        return Bluebird.try(async () => {
            await session.preLoginFlow();
            await session.login(username, password);
            _.defer(async () => await session.loginFlow());
            return session;
        });
    }
    setDevice(device) {
        this.device = device;
        return this;
    }
    getAccountId() {
        return this.cookieStore.getAccountId();
    }
    setProxy(url) {
        this.proxyUrl = url;
        return this;
    }
    async getAccount() {
        const accountId = await this.getAccountId();
        return account_1.Account.getById(this, accountId);
    }
    destroy() {
        return new request_1.Request(this)
            .setMethod('POST')
            .setResource('logout')
            .generateUUID()
            .send()
            .then(response => {
            this.cookieStore.destroy();
            delete this.cookieStore;
            return response;
        });
    }
    login(username, password) {
        return new request_1.Request(this)
            .setResource('login')
            .setMethod('POST')
            .setData({
            username,
            password,
            guid: this.uuid,
            phone_id: this.phone_id,
            device_id: this.device_id,
            adid: this.advertising_id,
            google_tokens: '[]',
            login_attempt_count: this.loginAttemptCount++,
        })
            .signPayload()
            .send()
            .tap(() => (this.loginAttemptCount = 0))
            .catch(exceptions_1.CheckpointError, async (error) => {
            await this.getAccountId().catch(exceptions_1.CookieNotValidError, () => {
                throw error;
            });
            return this;
        })
            .catch(exceptions_1.RequestError, error => {
            if (_.isObject(error.json)) {
                if (error.json.invalid_credentials)
                    throw new exceptions_1.AuthenticationError(error.message);
                if (error.json.error_type === 'inactive user')
                    throw new exceptions_1.AccountBannedError(`${error.json.message} ${error.json.help_url}`);
            }
            throw error;
        });
    }
    loginFlow(concurrency = 1) {
        return Bluebird.map([
            new feeds_1.TimelineFeed(this).get({}),
            new feeds_1.StoryTrayFeed(this).get(),
            new feeds_1.InboxFeed(this).get(),
            relationship_1.Relationship.getBootstrapUsers(this),
            internal_1.Internal.getRankedRecipients(this, 'reshare'),
            internal_1.Internal.getPresences(this),
            internal_1.Internal.getRecentActivityInbox(this),
            internal_1.Internal.getProfileNotice(this),
            internal_1.Internal.getExploreFeed(this),
        ], () => true, { concurrency });
    }
    preLoginFlow(concurrency = 1) {
        return Bluebird.map([
            internal_1.Internal.qeSync(this, true),
            internal_1.Internal.readMsisdnHeader(this),
            internal_1.Internal.launcherSync(this, true),
            internal_1.Internal.logAttribution(this),
            internal_1.Internal.fetchZeroRatingToken(this),
            internal_1.Internal.setContactPointPrefill(this),
        ], () => true, { concurrency }).catch(error => {
            throw new Error(error.message);
        });
    }
    serializeCookies() {
        return Bluebird.fromCallback(cb => this.jar._jar.serialize(cb));
    }
    async deserializeCookies(cookies) {
        this.jar._jar = await Bluebird.fromCallback(cb => tough_cookie_1.CookieJar.deserialize(cookies, this.cookieStore.store, cb));
    }
}
exports.Session = Session;
//# sourceMappingURL=session.js.map