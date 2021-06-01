import type * as expressSession from "express-session";
import type { Record } from "../../types/recordTypes";
export declare const updateRecord: (recordForm: Record, reqSession: expressSession.Session) => Promise<boolean>;
export default updateRecord;
