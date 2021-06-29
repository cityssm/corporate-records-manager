import type * as expressSession from "express-session";
export declare const removeURL: (urlID: number | string, requestSession: expressSession.Session) => Promise<boolean>;
export default removeURL;
