export interface RecordType {
    recordTypeKey: string;
    recordType: string;
    isActive: boolean;
}
interface TrackedValue {
    recordID?: number;
    recordCreate_userName?: string;
    recordCreate_datetime?: Date;
    recordUpdate_userName?: string;
    recordUpdate_datetime?: Date;
    recordDelete_userName?: string;
    recordDelete_datetime?: Date;
}
export declare type Record = {
    recordID: number;
    recordTypeKey: string;
    recordNumber: string;
    recordTitle: string;
    recordDescription: string;
    tags?: string[];
    statuses?: RecordStatus[];
    urls?: RecordURL[];
    comments?: RecordComment[];
} & TrackedValue;
export declare type RecordStatus = {
    statusLogID: number;
    statusTime: Date;
    statusTypeKey: string;
    statusLog: string;
} & TrackedValue;
export declare type RecordComment = {
    commentLogID: number;
    commentTime: Date;
    comment: string;
} & TrackedValue;
export declare type RecordURL = {
    urlID: number;
    url: string;
    urlTitle: string;
    urlDescription?: string;
} & TrackedValue;
export interface User {
    userName: string;
    canUpdate: boolean;
    isAdmin: boolean;
}
declare module "express-session" {
    interface Session {
        user: User;
    }
}
export {};
