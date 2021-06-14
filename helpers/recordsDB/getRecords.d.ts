import type { Record } from "../../types/recordTypes";
interface GetRecordsReturn {
    count: number;
    records: Record[];
}
export declare const getRecords: (params: {
    recordTypeKey: string;
    searchString: string;
}, options: {
    limit: number;
    offset: number;
}) => Promise<GetRecordsReturn>;
export default getRecords;
