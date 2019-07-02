import { LikeModuleName } from '../interfaces/like.interface';
export declare class Like {
    static post(action: 'like' | 'unlike', session: any, mediaId: string | number, moduleInfo?: LikeModuleName.Type): Promise<any>;
    static create(session: any, mediaId: string | number, moduleName: LikeModuleName.Type): Promise<any>;
    static destroy(session: any, mediaId: string | number, moduleName: LikeModuleName.Type): Promise<any>;
}
