import type { Record } from "../../types/recordTypes";
export declare const getRecords: (params: {
    recordTypeKey: string;
    searchString: string;
}) => Promise<Record[]>;
export default getRecords;
