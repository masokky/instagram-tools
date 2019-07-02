import { AbstractFeed } from './abstract.feed';
export declare class InboxPendingFeed extends AbstractFeed<any> {
    pendingRequestsTotal: any;
    constructor(session: any, limit: any);
    getPendingRequestsTotal(): any;
    get(): any;
}
