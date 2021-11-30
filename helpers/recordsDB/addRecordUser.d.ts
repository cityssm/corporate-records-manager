import type * as expressSession from "express-session";
import type { RecordUser } from "../../types/recordTypes";
export declare const addRecordUser: (recordUserForm: RecordUser, requestSession: expressSession.Session) => Promise<number>;
export default addRecordUser;
