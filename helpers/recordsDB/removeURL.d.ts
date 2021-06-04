import type * as expressSession from "express-session";
export declare const removeURL: (urlID: number | string, reqSession: expressSession.Session) => Promise<boolean>;
export default removeURL;
