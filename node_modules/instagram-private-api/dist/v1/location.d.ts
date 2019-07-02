import { InstagramResource as Resource } from './resource';
export declare class Location extends Resource {
    static getRankedMedia(session: any, locationId: any): any;
    static search(session: any, query: any): any;
    parseParams(json: any): any;
}
