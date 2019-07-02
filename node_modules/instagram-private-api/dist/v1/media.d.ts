import { Session } from '../core';
import * as Bluebird from 'bluebird';
import { UserResponse } from '../responses';
import { InstagramResource as Resource } from './resource';
export declare class Media extends Resource {
    static getById(session: any, id: any): any;
    static getByUrl(session: any, url: any): any;
    static likers(session: any, mediaId: any): Promise<UserResponse[]>;
    static delete(session: any, mediaId: any): any;
    static edit(session: any, mediaId: any, caption: any, userTags: any): any;
    static configurePhoto(session: Session, uploadId: any, caption: any, width: any, height: any, userTags: any, location: any): Bluebird<Media>;
    static configurePhotoStory(session: Session, uploadId: any, width: any, height: any): Bluebird<Media>;
    static configureVideo(session: any, uploadId: any, caption: any, durationms: any, delay: any, { audio_muted, trim_type, source_type, mas_opt_in, disable_comments, filter_type, poster_frame_index, geotag_enabled, camera_position, }?: {
        audio_muted?: boolean;
        trim_type?: number;
        source_type?: string;
        mas_opt_in?: string;
        disable_comments?: boolean;
        filter_type?: number;
        poster_frame_index?: number;
        geotag_enabled?: boolean;
        camera_position?: string;
    }): Bluebird<any>;
    static configurePhotoAlbum(session: Session, uploadId: any, caption: any, width: any, height: any, userTags: any): Promise<{
        source_type: string;
        caption: any;
        upload_id: any;
        media_folder: string;
        device: import("../core/devices/device.interface").IDevicePayload;
        edits: {
            crop_original_size: any[];
            crop_center: string[];
            crop_zoom: string;
        };
        extra: {
            source_width: any;
            source_height: any;
        };
    }>;
    static configureVideoAlbum(session: Session, uploadId: any, caption: any, durationms: any, delay: any, width: any, height: any): Bluebird<{
        filter_type: string;
        source_type: string;
        video_result: string;
        caption: any;
        upload_id: any;
        device: import("../core/devices/device.interface").IDevicePayload;
        length: number;
        clips: {
            length: number;
            source_type: string;
            camera_position: string;
        }[];
        audio_muted: boolean;
        poster_frame_index: number;
        extra: {
            source_width: any;
            source_height: any;
        };
    }>;
    static configureAlbum(session: any, medias: any, caption: any, disableComments: any): Bluebird<any>;
    parseParams(json: any): any;
    getParams(): any;
}
