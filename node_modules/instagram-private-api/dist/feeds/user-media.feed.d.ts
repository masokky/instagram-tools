import { MediaResponse } from '../responses/media.response';
import { Session } from '../core';
import { AbstractFeed } from './abstract.feed';
export declare class UserMediaFeed extends AbstractFeed<MediaResponse> {
    accountId: string | number;
    limit: number;
    constructor(session: Session, accountId: string | number, limit?: number);
    get(): Promise<MediaResponse[]>;
}
