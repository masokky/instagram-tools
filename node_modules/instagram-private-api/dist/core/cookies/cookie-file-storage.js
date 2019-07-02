"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_storage_1 = require("./cookie-storage");
const constants_1 = require("../../constants/constants");
const FileCookieStore = require('tough-cookie-file-store');
const touch = require('touch');
const path = require('path');
const fs = require('fs');
class CookieFileStorage extends cookie_storage_1.CookieStorage {
    constructor(cookiePath) {
        cookiePath = path.resolve(cookiePath);
        CookieFileStorage.ensureExistenceOfJSONFilePath(cookiePath);
        const store = new FileCookieStore(cookiePath);
        store.__proto__.getAllCookies = cb => {
            store.findCookies(constants_1.HOSTNAME, '/', (err, cookies) => {
                cookies.sort((a, b) => (a.creationIndex || 0) - (b.creationIndex || 0));
                cb(null, cookies);
            });
        };
        super(store);
    }
    static ensureExistenceOfJSONFilePath(path) {
        try {
            touch.sync(path);
            JSON.parse(fs.readFileSync(path));
        }
        catch (e) {
            fs.unlinkSync(path);
        }
        touch.sync(path);
    }
    destroy() {
        fs.unlinkSync(this.storage.filePath);
    }
}
exports.CookieFileStorage = CookieFileStorage;
//# sourceMappingURL=cookie-file-storage.js.map