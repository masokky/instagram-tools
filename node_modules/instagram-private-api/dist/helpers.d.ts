export declare class Helpers {
    static isValidUrl: any;
    static emailTester: RegExp;
    static validateEmail(email: any): boolean;
    static generateUUID(): string;
    static buildRankToken(accountId: any): string;
    static pathToStream(streamOrPath: any): any;
    static pathToBuffer(bufferOrPath: any): Promise<{}>;
    static extractUrl(text: any): any;
}
