import { InstagramResource as Resource } from './resource';
export declare class Thread extends Resource {
    static approveAll(session: any): any;
    static getById(session: any, id: any, cursor?: any): any;
    static configureText(session: any, users: any, text: any): any;
    static configurePhoto(session: any, users: any, upload_id: any): any;
    static configureMediaShare(session: any, users: any, mediaId: any, text: any): any;
    static configureProfile(session: any, users: any, profileId: any, simpleFormat: any, text: any): any;
    static configureHashtag(session: any, users: any, hashtag: any, simpleFormat: any, text: any): any;
    static recentRecipients(session: any): any;
    parseParams(json: any): any;
    getParams(): any;
    seen(): any;
    approve(): any;
    hide(): any;
    broadcastText(text: any): any;
    broadcastMediaShare(mediaId: any, text: any): any;
    broadcastProfile(profileId: any, simpleFormat: any, text: any): any;
    broadcastHashtag(hashtag: any, simpleFormat: any, text: any): any;
}
