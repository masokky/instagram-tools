export declare class AccountCreator {
    session: any;
    type: any;
    username: any;
    name: any;
    password: any;
    phone: any;
    phoneCallback: any;
    email: any;
    constructor(session: any, type: any);
    setUsername(username: any): this;
    setName(name: any): this;
    setPassword(password: any): this;
    checkUsername(username: any): any;
    usernameSuggestions(username: any): any;
    validateUsername(): any;
    autocomplete(account: any): any;
    validate(): Promise<void>;
    create(...args: any[]): void;
    register(): Promise<any>;
}
export declare class AccountPhoneCreator extends AccountCreator {
    constructor(session: any);
    setPhone(phone: any): this;
    setPhoneCallback(callback: any): this;
    validate(): any;
    create(): any;
}
export declare class AccountEmailCreator extends AccountCreator {
    constructor(session: any);
    setEmail(email: any): this;
    checkEmail(): any;
    validate(): any;
    create(): any;
}
