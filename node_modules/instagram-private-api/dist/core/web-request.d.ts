import * as Bluebird from 'bluebird';
import { Request } from './request';
import { Device } from '..';
import { Session } from './session';
export declare class WebRequest extends Request {
    private _jsonEndpoint;
    constructor(session: Session);
    setResource(resource: any, data: any): this;
    setDevice(device: Device): this;
    setJSONEndpoint(): this;
    setCSRFToken(token: any): this;
    setHost(host: any): this;
    send(options: any): Bluebird<any>;
}
