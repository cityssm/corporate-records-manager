import type * as expressSession from "express-session";
export declare const removeRecord: (recordID: number | string, requestSession: expressSession.Session) => Promise<boolean>;
export default removeRecord;
