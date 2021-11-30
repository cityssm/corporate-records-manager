import type * as recordTypes from "../../types/recordTypes";
export declare const getRecordTypes: () => Promise<recordTypes.RecordType[]>;
export declare const getRecordType: (recordTypeKey: string) => Promise<recordTypes.RecordType>;
export declare const clearCache: () => void;
export declare const getStatusTypes: (recordTypeKey: string) => Promise<recordTypes.StatusType[]>;
export declare const getRecordUserTypes: () => Promise<recordTypes.RecordUserType[]>;
