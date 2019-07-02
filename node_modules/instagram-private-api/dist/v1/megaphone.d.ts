import { InstagramResource as Resource } from './resource';
import { Request } from '../core/request';
export declare class Megaphone extends Resource {
    static log(session: any, data: any): Request;
    static logSeenMainFeed(session: any): Request;
}
