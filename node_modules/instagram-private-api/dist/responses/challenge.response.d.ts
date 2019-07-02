import { InstagramResponse } from './instagram.response';
export declare class ChallengeResponse extends InstagramResponse {
    step_name: string;
    step_data: any;
    user_id: number;
    nonce_code: string;
    status: string;
}
