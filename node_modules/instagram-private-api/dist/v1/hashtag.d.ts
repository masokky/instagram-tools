import { InstagramResource as Resource } from './resource';
export declare class Hashtag extends Resource {
    static search(session: any, query: any): any;
    static related(session: any, tag: any): any;
    static info(session: any, tag: any): any;
    parseParams(json: any): any;
}
