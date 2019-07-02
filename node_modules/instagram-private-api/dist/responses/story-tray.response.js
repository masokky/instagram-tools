"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const user_response_1 = require("./user.response");
const media_response_1 = require("./media.response");
const location_response_1 = require("./location.response");
const instagram_response_1 = require("./instagram.response");
class StoryTrayResponse extends instagram_response_1.InstagramResponse {
}
__decorate([
    class_transformer_1.Type(() => user_response_1.UserResponse),
    __metadata("design:type", user_response_1.UserResponse)
], StoryTrayResponse.prototype, "user", void 0);
__decorate([
    class_transformer_1.Type(() => location_response_1.LocationResponse),
    __metadata("design:type", location_response_1.LocationResponse)
], StoryTrayResponse.prototype, "location", void 0);
__decorate([
    class_transformer_1.Type(() => media_response_1.MediaResponse),
    __metadata("design:type", Array)
], StoryTrayResponse.prototype, "items", void 0);
exports.StoryTrayResponse = StoryTrayResponse;
//# sourceMappingURL=story-tray.response.js.map