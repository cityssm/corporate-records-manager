import type * as expressSession from "express-session";
import type { RecordStatus } from "../../types/recordTypes";
export declare const updateStatus: (statusForm: RecordStatus, requestSession: expressSession.Session) => Promise<boolean>;
export default updateStatus;
