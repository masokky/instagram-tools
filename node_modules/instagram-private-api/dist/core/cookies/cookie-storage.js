"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const constants_1 = require("../../constants/constants");
const _ = require("lodash");
const exceptions_1 = require("../exceptions");
class CookieStorage {
    constructor(storage) {
        this.storage = storage;
    }
    get store() {
        return this.storage;
    }
    getCookieValue(name) {
        return new Bluebird((resolve, reject) => {
            this.storage.findCookie(constants_1.TLD, '/', name, (err, cookie) => {
                if (err)
                    return reject(err);
                if (!_.isObject(cookie))
                    return reject(new exceptions_1.CookieNotValidError(name));
                resolve(cookie);
            });
        });
    }
    putCookie(cookie) {
        return Bluebird.fromCallback(cb => this.storage.putCookie(cookie, cb));
    }
    getCookies() {
        return new Bluebird((resolve, reject) => {
            this.storage.findCookies(constants_1.TLD, '/', (err, cookies) => {
                if (err)
                    return reject(err);
                resolve(cookies || []);
            });
        });
    }
    getAccountId() {
        return this.getCookieValue('ds_user_id').then(cookie => {
            const id = parseInt(cookie.value);
            if (_.isNumber(id) && !_.isNaN(id)) {
                return id;
            }
            else {
                throw new exceptions_1.CookieNotValidError('ds_user_id');
            }
        });
    }
    getSessionId() {
        const currentTime = new Date().getTime();
        return this.getCookieValue('sessionid').then(cookie => {
            const acceptable = cookie.expires instanceof Date && cookie.expires.getTime() > currentTime;
            if (acceptable)
                return cookie.value;
            throw new exceptions_1.CookieNotValidError('sessionid');
        });
    }
    removeCheckpointStep() {
        return new Bluebird((resolve, reject) => {
            this.storage.removeCookie(constants_1.TLD, '/', 'checkpoint_step', err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
    destroy() {
        throw new Error('Method destroy is not implemented');
    }
}
exports.CookieStorage = CookieStorage;
//# sourceMappingURL=cookie-storage.js.map