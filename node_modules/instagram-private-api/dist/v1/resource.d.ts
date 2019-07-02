declare const EventEmitter: any;
import { Request } from '../core/request';
export declare class InstagramResource extends EventEmitter {
    constructor(session: any, params: any);
    readonly params: any;
    readonly session: any;
    parseParams(params: any): any;
    setParams(params: any): this;
    getParams(): any;
    request(): Request;
}
export {};
