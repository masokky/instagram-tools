import { InstagramResponse } from './instagram.response';
declare class Challenge {
    url: string;
    api_path: string;
    hide_webview_header: boolean;
    lock: boolean;
    logout: boolean;
    native_flow: boolean;
}
export declare class CheckpointResponse extends InstagramResponse {
    message: string;
    challenge: Challenge;
    status: string;
    error_type: string;
}
export {};
