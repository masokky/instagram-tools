/// <reference types="node" />
import { EventEmitter } from 'events';
import { Session } from '../core/session';
export interface IBaseFeedAllOptions {
    delay: number;
    every: number;
    pause: number;
    maxErrors: number;
    limit: number;
}
export declare abstract class AbstractFeed<T> extends EventEmitter {
    session: Session;
    allResults: any[];
    totalCollected: number;
    cursor: any;
    moreAvailable: any;
    iteration: number;
    parseErrorsMultiplier: number;
    rankToken: string;
    limit: number;
    _stopAll: boolean;
    timeout: number;
    private allResultsMap;
    private _allResultsLentgh;
    protected constructor(session: Session);
    abstract get(...parameters: any[]): Promise<T[]>;
    all(parameters?: Partial<IBaseFeedAllOptions>): any;
    map(item: any): any;
    reduce(accumulator: any, response: any): any;
    filter(): boolean;
    _handleInfinityListBug(response: any, results: any): void;
    stop(): void;
    setCursor(cursor: any): void;
    getCursor(): any;
    isMoreAvailable(): boolean;
    allSafe(parameters: any, timeout?: number): any;
}
