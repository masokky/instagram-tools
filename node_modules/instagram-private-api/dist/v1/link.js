"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resource_1 = require("./resource");
class Link extends resource_1.InstagramResource {
    parseParams(json) {
        const hash = {};
        hash.text = json.text;
        hash.link = {
            url: json.link_context.link_url,
            title: json.link_context.link_title,
            summary: json.link_context.link_summary,
            image: {
                url: json.link_context.link_image_url,
            },
        };
        return hash;
    }
}
exports.Link = Link;
//# sourceMappingURL=link.js.map