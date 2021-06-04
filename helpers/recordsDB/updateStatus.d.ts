import type * as expressSession from "express-session";
import type { RecordStatus } from "../../types/recordTypes";
export declare const updateStatus: (statusForm: RecordStatus, reqSession: expressSession.Session) => Promise<boolean>;
export default updateStatus;
