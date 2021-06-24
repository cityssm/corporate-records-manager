/*
 * Config Tables
 */


export interface RecordType {
  recordTypeKey: string;
  recordType: string;
  minlength: number;
  maxlength: number;
  pattern: string;
  patternHelp: string;
  isActive?: boolean;
  recordCount?: number;
};


export interface StatusType {
  statusTypeKey: string;
  recordTypeKey?: string;
  statusType: string;
  isActive: boolean;
  recordCount?: number;
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
  recordTitle?: string;
  recordDescription?: string;
  party?: string;
  location?: string;
  recordDate?: Date;
  recordDateString?: string;
  tagCSV?: string;
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
  isActive?: boolean;
  password?: string;
};


declare module "express-session" {
  interface Session {
    user: User;
  }
};


export interface PartialSession {
  user: User;
}


/*
 * DocuShare
 */


export interface DocuShareRecordURL {
  recordID: number;
  recordTypeKey: string;
  recordNumber: string;
  urlID: number;
  url: string;
}

declare module "@cityssm/docushare/types" {
  interface DocuShareObject {
    url?: string;
  }
}
