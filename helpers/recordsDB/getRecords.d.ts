import type { Record } from "../../types/recordTypes";
interface GetRecordsReturn {
    count: number;
    records: Record[];
}
export declare const getRecords: (parameters: {
    recordTypeKey: string;
    searchString: string;
    recordNumber?: string;
    recordDateStringGTE?: string;
    recordDateStringLTE?: string;
}, options: {
    limit: number;
    offset: number;
}) => Promise<GetRecordsReturn>;
export default getRecords;
