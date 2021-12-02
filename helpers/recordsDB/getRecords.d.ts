import type { Record, PartialSession } from "../../types/recordTypes";
interface GetRecordsReturn {
    count: number;
    records: Record[];
}
export declare const getRecords: (parameters: {
    recordTypeKey: string;
    searchString: string;
    recordNumber?: string;
    recordTag?: string;
    recordDateStringGTE?: string;
    recordDateStringLTE?: string;
}, options: {
    limit: number;
    offset: number;
}, requestSession: PartialSession) => Promise<GetRecordsReturn>;
export default getRecords;
