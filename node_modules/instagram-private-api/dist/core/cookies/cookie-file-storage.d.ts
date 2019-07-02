import { CookieStorage } from './cookie-storage';
export declare class CookieFileStorage extends CookieStorage {
    constructor(cookiePath: any);
    static ensureExistenceOfJSONFilePath(path: any): void;
    destroy(): void;
}
