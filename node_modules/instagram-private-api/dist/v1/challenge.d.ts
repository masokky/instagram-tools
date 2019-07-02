import { CheckpointError, Session } from '../core';
import * as Bluebird from 'bluebird';
declare type ChallengeMethod = 'email' | 'phone';
export declare class Challenge {
    protected readonly session: Session;
    protected readonly error: CheckpointError;
    protected readonly json: any;
    constructor(session: Session, error: CheckpointError, json: any);
    static handleResponse(response: any, checkpointError: CheckpointError, defaultMethod: ChallengeMethod): any;
    static resolve(checkpointError: CheckpointError, defaultMethod: ChallengeMethod, resetFirst: boolean): Promise<any>;
    static resolveHtml(checkpointError: CheckpointError, defaultMethod: ChallengeMethod): any;
    static reset(checkpointError: CheckpointError): any;
    code(code: string | number): Bluebird<boolean>;
}
export declare class PhoneVerificationChallenge extends Challenge {
    readonly submitPhone: boolean;
    phone(userPhoneNumber: string | number): Error | Bluebird<PhoneVerificationChallenge>;
}
export declare class EmailVerificationChallenge extends Challenge {
}
export declare class NotImplementedChallenge extends Challenge {
    constructor(session: Session, error: CheckpointError, json: Object, challengeType: string);
}
export {};
