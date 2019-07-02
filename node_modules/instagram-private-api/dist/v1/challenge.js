"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
const Bluebird = require("bluebird");
const errors_1 = require("request-promise/errors");
const SHARED_JSON_REGEXP = /window._sharedData = (.*);<\/script>/i;
class Challenge {
    constructor(session, error, json) {
        this.session = session;
        this.error = error;
        this.json = json;
    }
    static async handleResponse(response, checkpointError, defaultMethod) {
        const session = checkpointError.session;
        let json;
        try {
            json = JSON.parse(response.body);
        }
        catch (e) {
            if (response.body.includes('url=instagram://checkpoint/dismiss'))
                throw new core_1.NoChallengeRequired();
            throw new TypeError('Invalid response. JSON expected');
        }
        session.challenge$.next(json);
        if (json.challenge && json.challenge.native_flow === false)
            return this.resolveHtml(checkpointError, defaultMethod);
        if (json.status === 'ok' && json.action === 'close')
            throw new core_1.NoChallengeRequired();
        const apiChallengeUrl = `https://i.instagram.com/api/v1${checkpointError.json.challenge.api_path}`;
        switch (json.step_name) {
            case 'select_verify_method': {
                const selectResponse = await new core_1.WebRequest(session)
                    .setMethod('POST')
                    .setUrl(apiChallengeUrl)
                    .setData({
                    choice: json.step_data.choice,
                })
                    .send({ followRedirect: true });
                return this.handleResponse(selectResponse, checkpointError, defaultMethod);
            }
            case 'verify_code':
            case 'submit_phone':
                return new PhoneVerificationChallenge(session, checkpointError, json);
            case 'verify_email':
                return new EmailVerificationChallenge(session, checkpointError, json);
            case 'delta_login_review':
                const deltaLoginResponse = await new core_1.WebRequest(session)
                    .setMethod('POST')
                    .setUrl(apiChallengeUrl)
                    .setData({
                    choice: 0,
                })
                    .send({ followRedirect: true });
                return this.handleResponse(deltaLoginResponse, checkpointError, defaultMethod);
            default:
                return new NotImplementedChallenge(session, checkpointError, json, json.step_name);
        }
    }
    static async resolve(checkpointError, defaultMethod = 'email', resetFirst) {
        const response = await Bluebird.try(async () => {
            if (resetFirst) {
                return {
                    body: JSON.stringify(await this.reset(checkpointError)),
                };
            }
            else {
                return new core_1.WebRequest(checkpointError.session)
                    .setMethod('GET')
                    .setUrl(`https://i.instagram.com/api/v1${checkpointError.json.challenge.api_path}?guid=${checkpointError.session.device.uuid}&device_id=${checkpointError.session.device.id}`)
                    .send({ followRedirect: true });
            }
        }).catch(errors_1.StatusCodeError, error => error.response);
        return this.handleResponse(response, checkpointError, defaultMethod);
    }
    static resolveHtml(checkpointError, defaultMethod) {
        const that = this;
        const session = checkpointError.session;
        return new core_1.WebRequest(session)
            .setMethod('GET')
            .setUrl(checkpointError.url)
            .setHeaders({
            Referer: checkpointError.url,
        })
            .send({ followRedirect: true })
            .catch(errors_1.StatusCodeError, error => error.response)
            .then(parseResponse);
        function parseResponse(response) {
            let choice;
            let challenge;
            let json;
            try {
                if (response.headers['content-type'] === 'application/json') {
                    json = JSON.parse(response.body);
                    challenge = json;
                }
                else {
                    json = JSON.parse(SHARED_JSON_REGEXP.exec(response.body)[1]);
                    challenge = json.entry_data.Challenge[0];
                }
            }
            catch (e) {
                throw new TypeError('Invalid response. JSON expected');
            }
            if (defaultMethod === 'email') {
                choice = challenge.fields.email ? 1 : 0;
            }
            else if (defaultMethod === 'phone') {
                choice = challenge.fields.phone_number ? 0 : 1;
            }
            switch (challenge.challengeType) {
                case 'SelectVerificationMethodForm': {
                    return new core_1.WebRequest(session)
                        .setMethod('POST')
                        .setUrl(checkpointError.url)
                        .setHeaders({
                        Referer: checkpointError.url,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Instagram-AJAX': 1,
                    })
                        .setData({
                        choice,
                    })
                        .send({ followRedirect: true })
                        .then(() => that.resolveHtml(checkpointError, defaultMethod));
                }
                case 'VerifyEmailCodeForm':
                    return new EmailVerificationChallenge(session, checkpointError, json);
                case 'VerifySMSCodeForm':
                    return new PhoneVerificationChallenge(session, checkpointError, json);
                default:
                    return new NotImplementedChallenge(session, checkpointError, json, challenge.challengeType);
            }
        }
    }
    static reset(checkpointError) {
        return new core_1.Request(checkpointError.session)
            .setMethod('POST')
            .setBodyType('form')
            .setUrl(checkpointError.apiUrl.replace('/challenge/', '/challenge/reset/'))
            .signPayload()
            .send({ followRedirect: true })
            .catch(error => error.response);
    }
    code(code) {
        return new core_1.WebRequest(this.session)
            .setMethod('POST')
            .setUrl(this.error.apiUrl)
            .setBodyType('form')
            .setData({
            security_code: code,
        })
            .send({ followRedirect: false })
            .then(response => {
            let json;
            try {
                json = JSON.parse(response.body);
            }
            catch (e) {
                throw new TypeError('Invalid response. JSON expected');
            }
            if (response.statusCode === 200 &&
                json.status === 'ok' &&
                (json.action === 'close' || json.location === 'instagram://checkpoint/dismiss')) {
                this.session.challenge$.next(null);
                return true;
            }
            throw new core_1.NotPossibleToResolveChallenge('Unknown error', core_1.NotPossibleToResolveChallenge.CODE.UNKNOWN);
        })
            .catch(errors_1.StatusCodeError, error => {
            if (error.statusCode === 400)
                throw new core_1.NotPossibleToResolveChallenge('Verification has not been accepted', core_1.NotPossibleToResolveChallenge.CODE.NOT_ACCEPTED);
            throw error;
        });
    }
}
exports.Challenge = Challenge;
class PhoneVerificationChallenge extends Challenge {
    get submitPhone() {
        return this.json.step_name === 'submit_phone';
    }
    phone(userPhoneNumber) {
        if (this.submitPhone === false)
            return Bluebird.resolve(this);
        let instagramPhoneNumber = this.json && this.json.step_data ? this.json.step_data.phone_number : null;
        let phone = userPhoneNumber || instagramPhoneNumber;
        if (!phone)
            return new Error('Invalid phone number');
        return new core_1.WebRequest(this.session)
            .setMethod('POST')
            .setUrl(this.error.apiUrl)
            .setBodyType('form')
            .setData({
            phone_number: phone,
        })
            .removeHeader('x-csrftoken')
            .send({ followRedirect: false })
            .then(response => {
            let json;
            try {
                json = JSON.parse(response.body);
            }
            catch (e) {
                throw new TypeError('Invalid response. JSON expected');
            }
            return new PhoneVerificationChallenge(this.session, this.error, json);
        });
    }
}
exports.PhoneVerificationChallenge = PhoneVerificationChallenge;
class EmailVerificationChallenge extends Challenge {
}
exports.EmailVerificationChallenge = EmailVerificationChallenge;
class NotImplementedChallenge extends Challenge {
    constructor(session, error, json, challengeType) {
        super(session, error, json);
        throw new Error(`Not implemented challenge type: "${challengeType}"`);
    }
}
exports.NotImplementedChallenge = NotImplementedChallenge;
//# sourceMappingURL=challenge.js.map