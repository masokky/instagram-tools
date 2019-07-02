import { InstagramResource as Resource } from './resource';
export declare class Comment extends Resource {
    static create(session: any, mediaId: any, text: any): any;
    static delete(session: any, mediaId: any, commentId: any): any;
    static bulkDelete(session: any, mediaId: any, commentIds: any): any;
    static like(session: any, commentId: any): any;
    parseParams(json: any): any;
    getParams(): any;
}
