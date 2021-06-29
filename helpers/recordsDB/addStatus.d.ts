import type * as expressSession from "express-session";
import type { RecordStatus } from "../../types/recordTypes";
export declare const addStatus: (statusForm: RecordStatus, requestSession: expressSession.Session) => Promise<number>;
export default addStatus;
