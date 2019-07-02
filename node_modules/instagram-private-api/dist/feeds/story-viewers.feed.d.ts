import { AbstractFeed } from './abstract.feed';
import { UserResponse } from '../responses/user.response';
export declare class StoryViewersFeed extends AbstractFeed<UserResponse> {
    mediaId: any;
    constructor(session: any, mediaId: any);
    get(): Promise<UserResponse[]>;
}
