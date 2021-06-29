import type * as expressSession from "express-session";
export declare const removeComment: (commentLogID: number | string, requestSession: expressSession.Session) => Promise<boolean>;
export default removeComment;
