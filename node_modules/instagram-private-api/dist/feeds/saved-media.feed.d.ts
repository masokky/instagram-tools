import { AbstractFeed } from './abstract.feed';
import { MediaResponse } from '../responses/media.response';
export declare class SavedMediaFeed extends AbstractFeed<MediaResponse> {
    limit: any;
    constructor(session: any, limit: any);
    get(): Promise<MediaResponse[]>;
}
