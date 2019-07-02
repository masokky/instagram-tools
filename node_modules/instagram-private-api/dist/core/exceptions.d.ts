import { CustomError } from 'ts-custom-error';
import { CheckpointResponse } from '../responses';
import { Session } from './session';
export declare class APIError extends CustomError {
    constructor(message?: string);
    serialize(): {
        error: string;
        errorMessage: string;
    };
}
export declare class RequestError extends APIError {
    json: any;
    constructor(json?: any);
}
export declare class AuthenticationError extends APIError {
    constructor(message?: string);
}
export declare class ParseError extends APIError {
    response: any;
    request: any;
    constructor(response: any, request: any);
    getUrl(): any;
}
export declare class ActionSpamError extends APIError {
    json: any;
    constructor(json: any);
    serialize(): any;
    getBlockTime(): number;
    getFeedbackMessage(): string;
}
export declare class CheckpointError extends APIError {
    json: CheckpointResponse;
    session: Session;
    constructor(json: CheckpointResponse, session: Session);
    readonly url: string;
    readonly apiUrl: string;
}
export declare class SentryBlockError extends APIError {
    json: any;
    constructor(json: any);
}
export declare class OnlyRankedItemsError extends APIError {
    constructor();
}
export declare class NotFoundError extends APIError {
    response: any;
    constructor(response: any);
}
export declare class PrivateUserError extends APIError {
    constructor(message?: string);
}
export declare class TooManyFollowsError extends APIError {
    constructor();
}
export declare class RequestsLimitError extends APIError {
    constructor();
}
export declare class CookieNotValidError extends APIError {
    constructor(cookieName: any);
}
export declare class IGAccountNotFoundError extends APIError {
    constructor();
}
export declare class ThreadEmptyError extends APIError {
    constructor();
}
export declare class AccountBannedError extends APIError {
    constructor(message: any);
}
export declare class PlaceNotFound extends APIError {
    constructor();
}
export declare class NotPossibleToResolveChallenge extends APIError {
    reason: string;
    code: string;
    static CODE: {
        RESET_NOT_WORKING: string;
        NOT_ACCEPTING_NUMBER: string;
        INCORRECT_NUMBER: string;
        INCORRECT_CODE: string;
        UNKNOWN: string;
        UNABLE_TO_PARSE: string;
        NOT_ACCEPTED: string;
    };
    constructor(reason?: string, code?: string);
}
export declare class NoChallengeRequired extends APIError {
    constructor();
}
export declare class InvalidEmail extends APIError {
    json?: any;
    constructor(email: any, json?: any);
}
export declare class InvalidUsername extends APIError {
    json?: any;
    constructor(username: any, json?: any);
}
export declare class InvalidPhone extends APIError {
    json?: any;
    constructor(phone: any, json?: any);
}
export declare class InvalidPassword extends APIError {
    constructor();
}
export declare class AccountRegistrationError extends APIError {
    json?: any;
    constructor(message: any, json?: any);
}
export declare class TranscodeTimeoutError extends APIError {
    constructor();
}
export declare class MediaUnavailableError extends APIError {
    constructor();
}
