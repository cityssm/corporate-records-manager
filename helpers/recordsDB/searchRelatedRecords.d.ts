import type { Record } from "../../types/recordTypes";
export declare const searchRelatedRecords: (recordID: number | string, recordTypeKey: string, searchString: string) => Promise<Record[]>;
export default searchRelatedRecords;
