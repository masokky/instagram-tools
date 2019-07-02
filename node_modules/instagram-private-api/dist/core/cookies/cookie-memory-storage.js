"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memstore_1 = require("tough-cookie/lib/memstore");
const cookie_storage_1 = require("./cookie-storage");
class CookieMemoryStorage extends cookie_storage_1.CookieStorage {
    constructor() {
        super(new memstore_1.MemoryCookieStore());
    }
    destroy() { }
}
exports.CookieMemoryStorage = CookieMemoryStorage;
//# sourceMappingURL=cookie-memory-storage.js.map