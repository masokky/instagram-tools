import { UserResponse } from '../responses/user.response';
import { AbstractFeed } from './abstract.feed';
export declare class AccountFollowingFeed extends AbstractFeed<UserResponse> {
    accountId: any;
    limit: number;
    constructor(session: any, accountId: any, limit?: number);
    get(): Promise<UserResponse[]>;
}
