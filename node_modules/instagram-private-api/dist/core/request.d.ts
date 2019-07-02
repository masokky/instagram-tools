/// <reference types="request" />
import { Session } from './session';
import { Device } from './devices/device';
export declare class Request {
    static requestClient: any;
    _request: any;
    protected _resource: any;
    private _signData;
    private attempts;
    constructor(session: Session);
    static readonly defaultHeaders: {
        'X-FB-HTTP-Engine': string;
        'X-IG-Connection-Type': string;
        'X-IG-Capabilities': string;
        'X-IG-Connection-Speed': string;
        'X-IG-Bandwidth-Speed-KBPS': string;
        'X-IG-Bandwidth-TotalBytes-B': string;
        'X-IG-Bandwidth-TotalTime-MS': string;
        Host: string;
        Accept: string;
        'Accept-Encoding': string;
        Connection: string;
    };
    protected _device: Device;
    device: Device;
    _url: any;
    url: any;
    private _session;
    session: Session;
    static jar(store: any): import("request").CookieJar;
    static setTimeout(ms: any): void;
    static setProxy(proxyUrl: any): void;
    _transform: (t: any) => any;
    setOptions(options?: {}, override?: any): this;
    setMethod(method: any): this;
    setData(data: any, override?: any): this;
    setBodyType(type: any): this;
    signPayload(): this;
    transform(callback: any): this;
    generateUUID(): this;
    setHeaders(headers: any): this;
    removeHeader(name: any): this;
    setUrl(url: any): this;
    setResource(resource: any, data?: any): this;
    setLocalAddress(ipAddress: any): this;
    setCSRFToken(token: any): this;
    setSession(session: any): this;
    setDevice(device: any): this;
    signData(): {
        signed_body: string;
        ig_sig_key_version: string;
    };
    _prepareData(): {};
    _mergeOptions(options: any): any;
    parseMiddleware(response: any): any;
    errorMiddleware(response: any): void;
    send(options?: {}, attempts?: number): any;
    sendAndGetRaw(options?: {}): any;
}
