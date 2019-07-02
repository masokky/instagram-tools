import { Session } from '../core';
import { MediaResponse } from '../responses/media.response';
export declare class UserStoryFeed {
    session: Session;
    userIds: (string | number)[];
    constructor(session: Session, userIds: (string | number)[]);
    get(): Promise<MediaResponse[]>;
}
