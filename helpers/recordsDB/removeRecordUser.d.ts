import type * as expressSession from "express-session";
export declare const removeRecordUser: (recordUserID: number | string, requestSession: expressSession.Session) => Promise<boolean>;
export default removeRecordUser;
