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
const friendship_status_response_1 = require("./friendship-status.response");
const instagram_response_1 = require("./instagram.response");
const image_version_response_1 = require("./image-version.response");
class UserResponse extends instagram_response_1.InstagramResponse {
    get id() {
        return (this.pk || this._id || this.instagram_id).toString();
    }
    set id(v) {
        this._id = v;
    }
    get picture() {
        return this.profile_pic_url;
    }
}
__decorate([
    class_transformer_1.Type(() => friendship_status_response_1.FriendshipStatusResponse),
    __metadata("design:type", friendship_status_response_1.FriendshipStatusResponse)
], UserResponse.prototype, "friendship_status", void 0);
__decorate([
    class_transformer_1.Type(() => image_version_response_1.ImageVersionResponse),
    __metadata("design:type", Array)
], UserResponse.prototype, "hd_profile_pic_versions", void 0);
__decorate([
    class_transformer_1.Type(() => image_version_response_1.ImageVersionResponse),
    __metadata("design:type", image_version_response_1.ImageVersionResponse)
], UserResponse.prototype, "hd_profile_pic_url_info", void 0);
__decorate([
    class_transformer_1.Exclude(),
    __metadata("design:type", Object)
], UserResponse.prototype, "_id", void 0);
__decorate([
    class_transformer_1.Expose(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], UserResponse.prototype, "id", null);
__decorate([
    class_transformer_1.Expose(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], UserResponse.prototype, "picture", null);
exports.UserResponse = UserResponse;
//# sourceMappingURL=user.response.js.map