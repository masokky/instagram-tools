import { StoryTrayResponse } from '../responses/story-tray.response';
export declare class StoryTrayFeed {
    private session;
    constructor(session: any);
    get(): Promise<StoryTrayResponse[]>;
}
