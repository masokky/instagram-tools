import { AbstractFeed } from './abstract.feed';
import { MediaResponse } from '../responses/media.response';
export declare class TaggedMediaFeed extends AbstractFeed<MediaResponse> {
    tag: string;
    limit: number;
    constructor(session: any, tag: string, limit?: number);
    getRawResponse(): Promise<any>;
    get(): Promise<MediaResponse[]>;
    getRankedItems(): Promise<MediaResponse[]>;
}
