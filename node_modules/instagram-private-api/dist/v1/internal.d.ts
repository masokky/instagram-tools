import * as Bluebird from 'bluebird';
import { Session } from '../core';
export declare class Internal {
    static readMsisdnHeader(session: Session): Bluebird<any>;
    static qeSync(session: Session, preLogin: any): any;
    static launcherSync(session: Session, preLogin: any): any;
    static logAttribution(session: Session): Bluebird<any>;
    static fetchZeroRatingToken(session: Session): Bluebird<any>;
    static setContactPointPrefill(session: Session): Bluebird<any>;
    static getRankedRecipients(session: Session, mode: any): Bluebird<any>;
    static getPresences(session: Session): Bluebird<any>;
    static getRecentActivityInbox(session: Session): Bluebird<any>;
    static getProfileNotice(session: Session): Bluebird<any>;
    static getExploreFeed(session: Session): Bluebird<any>;
}
