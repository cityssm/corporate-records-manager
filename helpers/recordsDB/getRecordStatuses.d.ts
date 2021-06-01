import type * as recordTypes from "../../types/recordTypes";
export declare const getRecordStatuses: (recordID: number | string) => Promise<recordTypes.RecordStatus[]>;
export default getRecordStatuses;
