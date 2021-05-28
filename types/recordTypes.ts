/*
 * Config Tables
 */


export interface RecordType {
  recordTypeKey: string;
  recordType: string;
  isActive: boolean;
}


/*
 * Records
 */


interface TrackedValue {
  recordID?: number;
  recordCreate_userName: string;
  recordCreate_datetime: Date;
  recordUpdate_userName: string;
  recordUpdate_datetime: Date;
  recordDelete_userName?: string;
  recordDelete_datetime?: Date;
}

export type Record = {
  recordID: number;
  recordTypeKey: string;
  recordNumber: string;
  recordTitle: string;
  recordDescription: string;
  tags?: RecordTag[];
  statuses?: RecordStatus[];
  commentLogs?: RecordComment[];
} & TrackedValue;


export interface RecordTag {
  tag: string;
  tagTypeKey?: string;
}


export type RecordStatus = {
  statusLogID: number;
  statusTime: Date;
  statusTypeKey: string;
  statusLog: string;
} & TrackedValue;


export type RecordComment = {
  commentLogID: number;
  commentTime: Date;
  comment: string;
} & TrackedValue;


export type RecordURL = {
  urlID: number;
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
