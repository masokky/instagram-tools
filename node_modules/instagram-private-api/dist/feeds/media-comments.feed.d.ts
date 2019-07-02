import { AbstractFeed } from './abstract.feed';
import { Session } from '../core';
import { CommentResponse } from '../responses/comment.response';
export declare class MediaCommentsFeed extends AbstractFeed<CommentResponse> {
    mediaId: any;
    cursorType: string;
    constructor(session: Session, mediaId: any);
    setCursor(cursor: any): void;
    get(): Promise<CommentResponse[]>;
}
