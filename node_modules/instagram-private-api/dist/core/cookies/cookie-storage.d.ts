import * as Bluebird from 'bluebird';
import { Store } from 'tough-cookie';
export declare class CookieStorage {
    storage: Store;
    constructor(storage: Store);
    readonly store: Store;
    getCookieValue(name: any): Bluebird<any>;
    putCookie(cookie: any): Bluebird<{}>;
    getCookies(): Bluebird<{}>;
    getAccountId(): Bluebird<number>;
    getSessionId(): Bluebird<any>;
    removeCheckpointStep(): Bluebird<{}>;
    destroy(): void;
}
