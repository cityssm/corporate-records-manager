/*
 * Config Tables
 */


export interface RecordType {
  recordTypeKey: string;
  recordType: string;
  isActive: boolean;
};


export interface StatusType {
  statusTypeKey: string;
  recordTypeKey?: string;
  statusType: string;
  isActive: boolean;
};


/*
 * Records
 */


interface TrackedValue {
  recordID?: number;
  recordCreate_userName?: string;
  recordCreate_datetime?: Date;
  recordUpdate_userName?: string;
  recordUpdate_datetime?: Date;
  recordDelete_userName?: string;
  recordDelete_datetime?: Date;
};


export type Record = {
  recordID: number;
  recordTypeKey: string;
  recordNumber: string;
  recordTitle: string;
  recordDescription: string;
  recordDate: Date;
  recordDateString?: string;
  tags?: string[];
  statuses?: RecordStatus[];
  urls?: RecordURL[];
  related?: Record[];
  comments?: RecordComment[];
} & TrackedValue;


export type RecordStatus = {
  statusLogID: number;
  statusTypeKey: string;
  statusTime: Date;
  statusDateString?: string;
  statusTimeString?: string;
  statusLog: string;
} & TrackedValue;


export type RecordComment = {
  commentLogID: number;
  commentTime: Date;
  commentDateString?: string;
  commentTimeString?: string;
  comment: string;
} & TrackedValue;


export type RecordURL = {
  urlID?: number;
  url: string;
  urlTitle: string;
  urlDescription?: string;
} & TrackedValue;


/*
 * User
 */


export interface User {
  userName: string;
  canUpdate: boolean;
  isAdmin: boolean;
};


declare module "express-session" {
  interface Session {
    user: User;
  }
};


/*
 * DocuShare Object
 */


declare module "@cityssm/docushare/types" {
  interface DocuShareObject {
    url?: string;
  }
}
