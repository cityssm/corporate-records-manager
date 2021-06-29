import type * as expressSession from "express-session";
import type { RecordComment } from "../../types/recordTypes";
export declare const addComment: (commentForm: RecordComment, requestSession: expressSession.Session) => Promise<number>;
export default addComment;
