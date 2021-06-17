import type * as expressSession from "express-session";
export declare const removeRecord: (recordID: number | string, reqSession: expressSession.Session) => Promise<boolean>;
export default removeRecord;
