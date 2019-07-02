import { InstagramResource as Resource } from './resource';
export declare class Relationship extends Resource {
    static get(session: any, accountId: any): any;
    static pendingFollowers(session: any): any;
    static approvePending(session: any, accountId: any): any;
    static removeFollower(session: any, accountId: any): any;
    static getMany(session: any, accountIds: any): any;
    static create(session: any, accountId: any): any;
    static destroy(session: any, accountId: any): any;
    static autocompleteUserList(session: any): any;
    static getBootstrapUsers(session: any): any;
    static block(session: any, accountId: any): any;
    static unblock(session: any, accountId: any): any;
    setAccountId(accountId: any): void;
    getParams(): any;
    approvePending(): any;
    removeFollower(): any;
    block(): any;
    unblock(): any;
}
