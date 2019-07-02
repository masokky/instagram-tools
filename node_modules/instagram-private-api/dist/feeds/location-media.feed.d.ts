import { AbstractFeed } from './abstract.feed';
import { MediaResponse } from '../responses/media.response';
export declare class LocationMediaFeed extends AbstractFeed<MediaResponse> {
    locationId: string | number;
    limit: number;
    constructor(session: any, locationId: string | number, limit?: number);
    get(): Promise<MediaResponse[]>;
}
