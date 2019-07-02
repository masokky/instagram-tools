import { AbstractFeed } from './abstract.feed';
export declare class ThreadItemsFeed extends AbstractFeed<any> {
    threadId: any;
    constructor(session: any, threadId: any, limit: any);
    get(): any;
}
