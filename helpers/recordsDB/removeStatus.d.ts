import type * as expressSession from "express-session";
export declare const removeStatus: (statusLogID: number | string, requestSession: expressSession.Session) => Promise<boolean>;
export default removeStatus;
