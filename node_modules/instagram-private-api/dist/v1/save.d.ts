import { InstagramResource as Resource } from './resource';
export declare class Save extends Resource {
    static create(session: any, mediaId: any): any;
    static destroy(session: any, mediaId: any): any;
    parseParams(json: any): any;
}
