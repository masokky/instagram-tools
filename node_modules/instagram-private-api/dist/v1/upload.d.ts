import { InstagramResource as Resource } from './resource';
export declare class Upload extends Resource {
    static photo(session: any, streamOrPathOrBuffer: any, uploadId: any, name: any, isSidecar: any): Promise<any>;
    static video(session: any, videoBufferOrPath: any, photoStreamOrPath: any, isSidecar: any, fields?: any): Promise<any>;
    static album(session: any, medias: any, caption: any, disableComments: any): any;
    parseParams(json: any): any;
}
