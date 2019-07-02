"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Chance = require("chance");
const devices = require("./devices.json");
const builds = require("./builds.json");
const CONSTANTS = require("../../constants/constants");
const _ = require("lodash");
const json_pruned_1 = require("../../v1/json-pruned");
const hmac = require("crypto-js/hmac-sha256");
class Device {
    constructor(username) {
        this.username = username;
        this.credentials = CONSTANTS.APP_CREDENTIALS;
        const chance = new Chance(username);
        this.deviceString = chance.pickone(devices);
        const id = chance.string({
            pool: 'abcdef0123456789',
            length: 16,
        });
        this.id = `android-${id}`;
        this.uuid = chance.guid();
        this.phoneId = chance.guid();
        this.adid = chance.guid();
        const deviceParts = this.deviceString.split(';');
        const [android_version, android_release] = deviceParts[0].split('/');
        const [manufacturer] = deviceParts[3].split('/');
        const model = deviceParts[4];
        this.payload = {
            android_version,
            android_release,
            manufacturer,
            model,
        };
        this.android_version = android_version;
        this.android_release = android_release;
        this.build = chance.pickone(builds);
        this.model = model;
        this.md5 = chance.string({
            pool: 'abcdefghijklmnopqrstuvwxyz0123456789',
            length: 32,
        });
    }
    assignCredentials(credentials) {
        this.credentials = Object.assign(this.credentials, credentials);
    }
    signRequestPayload(payload) {
        const json = _.isString(payload) ? payload : json_pruned_1.pruned(payload);
        const signature = hmac(json, this.credentials.SIG_KEY).toString();
        return {
            signed_body: `${signature}.${json}`,
            ig_sig_key_version: this.credentials.SIG_VERSION,
        };
    }
    userAgent() {
        return Device.appUserAgentTemplate({
            agent: [this.deviceString, this.credentials.LANGUAGE, this.credentials.VERSION_CODE].join('; '),
            version: this.credentials.VERSION,
        });
    }
    userAgentWeb() {
        return Device.webUserAgentTemplate({
            instagramAgent: this.userAgent(),
            release: this.android_release,
            model: this.model,
            build: this.build,
        });
    }
}
Device.appUserAgentTemplate = _.template('Instagram <%= version %> Android (<%= agent %>)');
Device.webUserAgentTemplate = _.template('Mozilla/5.0 (Linux; Android <%= release %>; <%= model %> Build/<%= build %>; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.110 Mobile Safari/537.36 <%= instagramAgent %>');
exports.Device = Device;
//# sourceMappingURL=device.js.map