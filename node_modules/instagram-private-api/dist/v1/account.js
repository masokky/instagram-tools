"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const class_transformer_1 = require("class-transformer");
const user_response_1 = require("../responses/user.response");
const core_1 = require("../core");
const helpers_1 = require("../helpers");
class Account {
    static async getById(session, id) {
        const data = await new core_1.Request(session)
            .setMethod('GET')
            .setResource('userInfo', { id })
            .send();
        return class_transformer_1.plainToClass(user_response_1.UserResponse, data.user);
    }
    static async search(session, username) {
        const uid = await session.getAccountId();
        const rankToken = helpers_1.Helpers.buildRankToken(uid);
        const data = await new core_1.Request(session)
            .setMethod('GET')
            .setResource('accountsSearch', {
            query: username,
            rankToken,
        })
            .send();
        return class_transformer_1.plainToClass(user_response_1.UserResponse, data.users);
    }
    static async searchForUser(session, username) {
        username = username.toLowerCase();
        const accounts = await Account.search(session, username);
        const account = accounts.find(account => account.username === username);
        if (!account)
            throw new core_1.IGAccountNotFoundError();
        return account;
    }
    static async setProfilePicture(session, streamOrPath) {
        const stream = helpers_1.Helpers.pathToStream(streamOrPath);
        const request = new core_1.Request(session);
        const data = await request
            .setMethod('POST')
            .setResource('changeProfilePicture')
            .generateUUID()
            .signPayload()
            .transform(opts => {
            opts.formData.profile_pic = {
                value: stream,
                options: {
                    filename: 'profile_pic',
                    contentType: 'image/jpeg',
                },
            };
            return opts;
        })
            .send();
        return class_transformer_1.plainToClass(user_response_1.UserResponse, data.user);
    }
    static async setPrivacy(session, pri) {
        const data = await new core_1.Request(session)
            .setMethod('POST')
            .setResource(pri ? 'setAccountPrivate' : 'setAccountPublic')
            .generateUUID()
            .signPayload()
            .send();
        return class_transformer_1.plainToClass(user_response_1.UserResponse, data.user);
    }
    static editProfile(session, settings) {
        settings = _.isObject(settings) ? settings : {};
        if (_.isString(settings.phoneNumber))
            settings.phone_number = settings.phoneNumber;
        if (_.isString(settings.fullName))
            settings.first_name = settings.fullName;
        if (_.isString(settings.externalUrl))
            settings.external_url = settings.externalUrl;
        const pickData = o => _.pick(o, 'gender', 'biography', 'phone_number', 'first_name', 'external_url', 'username', 'email');
        return new core_1.Request(session)
            .setMethod('GET')
            .setResource('currentAccount')
            .send()
            .then(json => new core_1.Request(session)
            .setMethod('POST')
            .setResource('editAccount')
            .generateUUID()
            .setData(pickData(_.extend(json.user, settings)))
            .signPayload()
            .send())
            .then(json => {
            const account = class_transformer_1.plainToClass(user_response_1.UserResponse, json.user);
            return this.getById(session, account.id);
        })
            .catch(e => {
            if (e && e.json && e.json.message && _.isArray(e.json.message.errors)) {
                throw new core_1.RequestError({
                    message: e.json.message.errors.join('. '),
                });
            }
            throw e;
        });
    }
    static async showProfile(session) {
        const data = await new core_1.Request(session)
            .setMethod('GET')
            .setResource('currentAccount')
            .send();
        return class_transformer_1.plainToClass(user_response_1.UserResponse, data.user);
    }
}
exports.Account = Account;
//# sourceMappingURL=account.js.map