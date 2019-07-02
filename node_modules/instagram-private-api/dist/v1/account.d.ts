import { UserResponse } from '../responses/user.response';
import { Session } from '../core';
export declare class Account {
    static getById(session: Session, id: string | number): Promise<UserResponse>;
    static search(session: Session, username: string): Promise<UserResponse[]>;
    static searchForUser(session: Session, username: string): Promise<UserResponse>;
    static setProfilePicture(session: Session, streamOrPath: any): Promise<UserResponse>;
    static setPrivacy(session: Session, pri: boolean | number | string): Promise<UserResponse>;
    static editProfile(session: Session, settings: any): any;
    static showProfile(session: Session): Promise<UserResponse>;
}
