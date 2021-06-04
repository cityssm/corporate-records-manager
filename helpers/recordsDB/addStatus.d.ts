import type * as expressSession from "express-session";
import type { RecordStatus } from "../../types/recordTypes";
export declare const addStatus: (statusForm: RecordStatus, reqSession: expressSession.Session) => Promise<number>;
export default addStatus;
