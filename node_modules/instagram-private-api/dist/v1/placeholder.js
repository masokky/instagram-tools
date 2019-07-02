"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resource_1 = require("./resource");
class Placeholder extends resource_1.InstagramResource {
    parseParams(json) {
        const hash = {};
        hash.is_linked = json.is_linked;
        hash.title = json.title;
        hash.message = json.message;
        return hash;
    }
}
exports.Placeholder = Placeholder;
//# sourceMappingURL=placeholder.js.map