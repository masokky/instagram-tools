"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const ts_custom_error_1 = require("ts-custom-error");
const routes = require("./routes");
class APIError extends ts_custom_error_1.CustomError {
    constructor(message = 'Instagram API error was made.') {
        super(message);
    }
    serialize() {
        return {
            error: this.constructor.name,
            errorMessage: this.message,
        };
    }
}
exports.APIError = APIError;
class RequestError extends APIError {
    constructor(json = {}) {
        super(json.message || `It's not possible to make request!`);
        this.json = json;
    }
}
exports.RequestError = RequestError;
class AuthenticationError extends APIError {
    constructor(message = 'Not possible to authenticate') {
        super(message);
    }
}
exports.AuthenticationError = AuthenticationError;
class ParseError extends APIError {
    constructor(response, request) {
        super('Not possible to parse API response');
        this.response = response;
        this.request = request;
        this.response = response;
    }
    getUrl() {
        return this.request.url;
    }
}
exports.ParseError = ParseError;
class ActionSpamError extends APIError {
    constructor(json) {
        super('This action was disabled due to block from instagram!');
        this.json = json;
        this.json = json;
    }
    serialize() {
        return _.extend(APIError.prototype.serialize.call(this), {
            errorData: {
                blockTime: this.getBlockTime(),
                message: this.getFeedbackMessage(),
            },
        });
    }
    getBlockTime() {
        if (_.isObject(this.json) && _.isString(this.json.feedback_message)) {
            const hours = this.json.feedback_message.match(/(\d+)(\s)*hour(s)/);
            if (!hours || !_.isArray(hours))
                return 0;
            const blockTime = parseInt(hours[1]) * 60 * 60 * 1000;
            return blockTime + 1000 * 60 * 5;
        }
        return 0;
    }
    getFeedbackMessage() {
        let message = 'No feedback message';
        if (_.isString(this.json.feedback_message)) {
            const title = _.isString(this.json.feedback_title) ? this.json.feedback_title + ': ' : '';
            message = title + this.json.feedback_message;
        }
        return message;
    }
}
exports.ActionSpamError = ActionSpamError;
class CheckpointError extends APIError {
    constructor(json, session) {
        super('Instagram call checkpoint for this action!');
        this.json = json;
        this.session = session;
    }
    get url() {
        if (_.isObject(this.json.challenge) && _.isString(this.json.challenge.url)) {
            return this.json.challenge.url;
        }
        return routes.getWebUrl('challenge');
    }
    get apiUrl() {
        return 'https://i.instagram.com/api/v1' + this.json.challenge.api_path;
    }
}
exports.CheckpointError = CheckpointError;
class SentryBlockError extends APIError {
    constructor(json) {
        super('Sentry block from instagram');
        this.json = json;
    }
}
exports.SentryBlockError = SentryBlockError;
class OnlyRankedItemsError extends APIError {
    constructor() {
        super('Tag has only ranked items to show, due to blocked content');
    }
}
exports.OnlyRankedItemsError = OnlyRankedItemsError;
class NotFoundError extends APIError {
    constructor(response) {
        super(`Page wasn't found!`);
        this.response = response;
    }
}
exports.NotFoundError = NotFoundError;
class PrivateUserError extends APIError {
    constructor(message = 'User is private and you are not authorized to view his content!') {
        super(message);
    }
}
exports.PrivateUserError = PrivateUserError;
class TooManyFollowsError extends APIError {
    constructor() {
        super('Account has just too much follows');
    }
}
exports.TooManyFollowsError = TooManyFollowsError;
class RequestsLimitError extends APIError {
    constructor() {
        super('You just made too many request to instagram API');
    }
}
exports.RequestsLimitError = RequestsLimitError;
class CookieNotValidError extends APIError {
    constructor(cookieName) {
        super(`Cookie '${cookieName}' you are searching found was either not found or not valid!`);
    }
}
exports.CookieNotValidError = CookieNotValidError;
class IGAccountNotFoundError extends APIError {
    constructor() {
        super('Account you are searching for was not found!');
    }
}
exports.IGAccountNotFoundError = IGAccountNotFoundError;
class ThreadEmptyError extends APIError {
    constructor() {
        super('Thread is empty there are no items!');
    }
}
exports.ThreadEmptyError = ThreadEmptyError;
class AccountBannedError extends APIError {
    constructor(message) {
        super(message);
    }
}
exports.AccountBannedError = AccountBannedError;
class PlaceNotFound extends APIError {
    constructor() {
        super('Place you are searching for not exists!');
    }
}
exports.PlaceNotFound = PlaceNotFound;
class NotPossibleToResolveChallenge extends APIError {
    constructor(reason = 'Unknown reason', code = NotPossibleToResolveChallenge.CODE.UNKNOWN) {
        super(`Not possible to resolve challenge (${reason})!`);
        this.reason = reason;
        this.code = code;
    }
}
NotPossibleToResolveChallenge.CODE = {
    RESET_NOT_WORKING: 'RESET_NOT_WORKING',
    NOT_ACCEPTING_NUMBER: 'NOT_ACCEPTING_NUMBER',
    INCORRECT_NUMBER: 'INCORRECT_NUMBER',
    INCORRECT_CODE: 'INCORRECT_CODE',
    UNKNOWN: 'UNKNOWN',
    UNABLE_TO_PARSE: 'UNABLE_TO_PARSE',
    NOT_ACCEPTED: 'NOT_ACCEPTED',
};
exports.NotPossibleToResolveChallenge = NotPossibleToResolveChallenge;
class NoChallengeRequired extends APIError {
    constructor() {
        super('No challenge is required to use account!');
    }
}
exports.NoChallengeRequired = NoChallengeRequired;
class InvalidEmail extends APIError {
    constructor(email, json) {
        super(`${email} email is not an valid email`);
        this.json = json;
    }
}
exports.InvalidEmail = InvalidEmail;
class InvalidUsername extends APIError {
    constructor(username, json) {
        super(`${username} username is not an valid username`);
        this.json = json;
    }
}
exports.InvalidUsername = InvalidUsername;
class InvalidPhone extends APIError {
    constructor(phone, json) {
        super(`${phone} phone is not a valid phone`);
        this.json = json;
    }
}
exports.InvalidPhone = InvalidPhone;
class InvalidPassword extends APIError {
    constructor() {
        super('Password must be at least 6 chars long');
    }
}
exports.InvalidPassword = InvalidPassword;
class AccountRegistrationError extends APIError {
    constructor(message, json) {
        super(message);
        this.json = json;
    }
}
exports.AccountRegistrationError = AccountRegistrationError;
class TranscodeTimeoutError extends APIError {
    constructor() {
        super('Server did not transcoded uploaded video in time');
    }
}
exports.TranscodeTimeoutError = TranscodeTimeoutError;
class MediaUnavailableError extends APIError {
    constructor() {
        super('Media is unavailable');
    }
}
exports.MediaUnavailableError = MediaUnavailableError;
//# sourceMappingURL=exceptions.js.map