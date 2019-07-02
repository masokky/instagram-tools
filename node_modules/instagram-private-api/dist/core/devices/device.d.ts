import * as _ from 'lodash';
import { IAppCredentials, IDevicePayload } from './device.interface';
export declare class Device {
    username: string;
    static appUserAgentTemplate: _.TemplateExecutor;
    static webUserAgentTemplate: _.TemplateExecutor;
    deviceString: string;
    android_version: string;
    android_release: string;
    model: string;
    build: string;
    md5: string;
    uuid: string;
    phoneId: string;
    adid: string;
    id: string;
    credentials: IAppCredentials;
    payload: IDevicePayload;
    constructor(username: string);
    assignCredentials(credentials: Partial<IAppCredentials>): void;
    signRequestPayload(payload: any): {
        signed_body: string;
        ig_sig_key_version: string;
    };
    userAgent(): string;
    userAgentWeb(): string;
}
