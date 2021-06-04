import type * as expressSession from "express-session";
import type * as recordTypes from "../../types/recordTypes";
export declare const updateURL: (recordURL: recordTypes.RecordURL, reqSession: expressSession.Session) => Promise<boolean>;
export default updateURL;
