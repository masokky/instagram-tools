import { Session } from '../core';
import { AbstractFeed } from './abstract.feed';
export declare class InboxFeed extends AbstractFeed<any> {
    limit: number;
    pendingRequestsTotal: null;
    constructor(session: Session, limit?: number);
    getPendingRequestsTotal(): null;
    get(): Promise<any>;
}
