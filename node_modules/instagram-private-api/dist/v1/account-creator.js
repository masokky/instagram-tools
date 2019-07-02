"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const responses_1 = require("../responses");
const core_1 = require("../core");
const helpers_1 = require("../helpers");
const Exceptions = require("../core/exceptions");
const qe_1 = require("./qe");
const relationship_1 = require("./relationship");
const discover_1 = require("./discover");
const thread_1 = require("./thread");
const _ = require('lodash');
const clean = require('underscore.string/clean');
class AccountCreator {
    constructor(session, type) {
        if (!(session instanceof core_1.Session))
            throw new Error('AccountCreator needs valid session as first argument');
        this.session = session;
        if (!_.includes(['phone', 'email'], type))
            throw new Error('AccountCreator class needs either phone or email as type');
        this.type = type;
    }
    setUsername(username) {
        username = username.toLowerCase();
        if (!username || !/^[a-z0-9._]{1,50}$/.test(username))
            throw new Exceptions.InvalidUsername(username);
        this.username = username;
        return this;
    }
    setName(name) {
        this.name = name;
        return this;
    }
    setPassword(password) {
        if (!password || password.length < 6)
            throw new Exceptions.InvalidPassword();
        this.password = password;
        return this;
    }
    checkUsername(username) {
        return new core_1.Request(this.session)
            .setMethod('POST')
            .setResource('checkUsername')
            .setData({ username })
            .signPayload()
            .send();
    }
    usernameSuggestions(username) {
        return new core_1.Request(this.session)
            .setMethod('POST')
            .setResource('usernameSuggestions')
            .setData({
            name: username,
        })
            .signPayload()
            .send();
    }
    validateUsername() {
        const username = this.username;
        const self = this;
        if (!username)
            return Promise.reject(new Exceptions.InvalidUsername('Empty'));
        return this.checkUsername(username)
            .then(json => {
            if (!json.available)
                throw new Exceptions.InvalidUsername(username, json);
            return true;
        })
            .catch(Exceptions.InvalidUsername, e => self.usernameSuggestions(username).then(json => {
            e.json.suggestions = json.suggestions_with_metadata.suggestions;
            throw e;
        }));
    }
    autocomplete(account) {
        const session = this.session;
        return qe_1.QE.sync(session)
            .then(() => {
            const autocomplete = relationship_1.Relationship.autocompleteUserList(session).catch(Exceptions.RequestsLimitError, () => false);
            return [account, autocomplete];
        })
            .spread(account => [account, thread_1.Thread.recentRecipients(session)])
            .spread(account => [account, discover_1.discover(session, true)]);
    }
    async validate() {
        throw new Error('Please override this method in order to validate account');
    }
    create(...args) {
        throw new Error('Please override this method in order to register account');
    }
    register() {
        const args = _.toArray(arguments);
        const self = this;
        return self
            .validate()
            .then(() => self.create(...args))
            .then(account => self.autocomplete(account));
    }
}
exports.AccountCreator = AccountCreator;
class AccountPhoneCreator extends AccountCreator {
    constructor(session) {
        super(session, 'phone');
    }
    setPhone(phone) {
        if (!phone || !/^([0-9()\/+ \-]*)$/.test(phone))
            throw new Exceptions.InvalidPhone(phone);
        this.phone = phone;
        return this;
    }
    setPhoneCallback(callback) {
        if (!_.isFunction(callback))
            throw new Error('Callback must be function which returns promise');
        this.phoneCallback = callback;
        return this;
    }
    validate() {
        if (!this.phoneCallback)
            throw new Error('You must call `setPhoneCallback` and supply callback');
        return this.validateUsername();
    }
    create() {
        const that = this;
        return new core_1.Request(that.session)
            .setMethod('POST')
            .setResource('registrationSMSCode')
            .setData({
            phone_number: that.phone,
        })
            .signPayload()
            .send()
            .then(json => that.phoneCallback())
            .then(code => {
            if (!_.isString(code) && !_.isNumber(code))
                throw new Exceptions.AccountRegistrationError('Code is invalid');
            code = clean(code.toString().trim()).replace(/\s+/, '');
            if (code.toString().length !== 6)
                throw new Error('Code must be 6 digits number');
            return [
                new core_1.Request(that.session)
                    .setMethod('POST')
                    .setResource('registrationValidateSMSCode')
                    .setData({
                    phone_number: that.phone,
                    verification_code: code,
                })
                    .signPayload()
                    .send(),
                code,
            ];
        })
            .spread((json, code) => {
            if (!json.verified)
                throw new Exceptions.AccountRegistrationError('Code is invalid', json);
            return new core_1.Request(that.session)
                .setMethod('POST')
                .setResource('registrationCreateValidated')
                .setData({
                password: that.password,
                username: that.username,
                phone_number: that.phone,
                verification_code: code,
                first_name: that.name,
                force_sign_up_code: '',
                qs_stamp: '',
                phone_id: helpers_1.Helpers.generateUUID(),
                guid: helpers_1.Helpers.generateUUID(),
                waterfall_id: helpers_1.Helpers.generateUUID(),
            })
                .signPayload()
                .send();
        })
            .then(json => {
            if (!json.account_created)
                throw new Exceptions.AccountRegistrationError(null, json);
            return class_transformer_1.plainToClass(responses_1.UserResponse, json.created_user);
        });
    }
}
exports.AccountPhoneCreator = AccountPhoneCreator;
class AccountEmailCreator extends AccountCreator {
    constructor(session) {
        super(session, 'email');
    }
    setEmail(email) {
        if (!email || !helpers_1.Helpers.validateEmail(email))
            throw new Exceptions.InvalidEmail(email);
        this.email = email;
        return this;
    }
    checkEmail() {
        return new core_1.Request(this.session)
            .setMethod('POST')
            .setResource('checkEmail')
            .setData({
            email: this.email,
            qe_id: helpers_1.Helpers.generateUUID(),
        })
            .signPayload()
            .send();
    }
    validate() {
        const email = this.email;
        const validateEmail = _.bind(this.checkEmail, this);
        if (!email || !helpers_1.Helpers.validateEmail(email))
            return Promise.reject(new Exceptions.InvalidEmail(email));
        return this.validateUsername()
            .then(() => validateEmail())
            .then(json => {
            if (!json.available || !json.valid)
                return Promise.reject(new Exceptions.InvalidEmail(email));
            return true;
        });
    }
    create() {
        const uuid = helpers_1.Helpers.generateUUID();
        const guid = helpers_1.Helpers.generateUUID();
        const that = this;
        return new core_1.Request(that.session)
            .setMethod('POST')
            .setResource('registrationCreate')
            .setData({
            phone_id: uuid,
            username: that.username,
            first_name: that.name,
            guid,
            email: that.email,
            force_sign_up_code: '',
            qs_stamp: '',
            password: that.password,
        })
            .signPayload()
            .send()
            .then(json => {
            if (!json.account_created)
                throw new Exceptions.AccountRegistrationError(null, json);
            return class_transformer_1.plainToClass(responses_1.UserResponse, json.created_user);
        });
    }
}
exports.AccountEmailCreator = AccountEmailCreator;
//# sourceMappingURL=account-creator.js.map