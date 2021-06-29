import type * as expressSession from "express-session";
import type { Record } from "../../types/recordTypes";
export declare const createRecord: (recordForm: Record, requestSession: expressSession.Session) => Promise<number>;
export default createRecord;
