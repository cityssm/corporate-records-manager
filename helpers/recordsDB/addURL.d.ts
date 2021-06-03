import type * as expressSession from "express-session";
import type { RecordURL } from "../../types/recordTypes";
export declare const addURL: (urlForm: RecordURL, reqSession: expressSession.Session) => Promise<number>;
export default addURL;
