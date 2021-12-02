import type { Record, PartialSession } from "../../types/recordTypes";
export declare const getRecord: (recordID: number | string, requestSession: PartialSession) => Promise<Record>;
export default getRecord;
