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
const comment_response_1 = require("./comment.response");
const image_version_response_1 = require("./image-version.response");
const location_response_1 = require("./location.response");
const video_version_response_1 = require("./video-version.response");
const instagram_response_1 = require("./instagram.response");
class MediaResponse extends instagram_response_1.InstagramResponse {
    get webLink() {
        return `https://www.instagram.com/p/${this.code}/`;
    }
    get account() {
        return this.user;
    }
    get takenAt() {
        return this.taken_at * 1000;
    }
    get images() {
        return this.image_versions2;
    }
    get videos() {
        return this.video_versions;
    }
}
__decorate([
    class_transformer_1.Type(() => comment_response_1.CommentResponse),
    __metadata("design:type", Array)
], MediaResponse.prototype, "preview_comments", void 0);
__decorate([
    class_transformer_1.Type(() => MediaResponse),
    __metadata("design:type", Array)
], MediaResponse.prototype, "carousel_media", void 0);
__decorate([
    class_transformer_1.Type(() => image_version_response_1.ImageVersionResponse),
    class_transformer_1.Transform(image_versions2 => image_versions2.candidates, { toClassOnly: true }),
    __metadata("design:type", Array)
], MediaResponse.prototype, "image_versions2", void 0);
__decorate([
    class_transformer_1.Type(() => video_version_response_1.VideoVersionResponse),
    __metadata("design:type", Array)
], MediaResponse.prototype, "video_versions", void 0);
__decorate([
    class_transformer_1.Type(() => location_response_1.LocationResponse),
    __metadata("design:type", location_response_1.LocationResponse)
], MediaResponse.prototype, "location", void 0);
__decorate([
    class_transformer_1.Type(() => user_response_1.UserResponse),
    __metadata("design:type", user_response_1.UserResponse)
], MediaResponse.prototype, "user", void 0);
__decorate([
    class_transformer_1.Type(() => comment_response_1.CommentResponse),
    __metadata("design:type", Object)
], MediaResponse.prototype, "caption", void 0);
__decorate([
    class_transformer_1.Type(() => user_response_1.UserResponse),
    __metadata("design:type", Array)
], MediaResponse.prototype, "likers", void 0);
__decorate([
    class_transformer_1.Expose(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MediaResponse.prototype, "webLink", null);
__decorate([
    class_transformer_1.Expose(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MediaResponse.prototype, "account", null);
__decorate([
    class_transformer_1.Expose(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MediaResponse.prototype, "takenAt", null);
__decorate([
    class_transformer_1.Expose(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MediaResponse.prototype, "images", null);
__decorate([
    class_transformer_1.Expose(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MediaResponse.prototype, "videos", null);
exports.MediaResponse = MediaResponse;
//# sourceMappingURL=media.response.js.map