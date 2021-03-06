import type * as expressSession from "express-session";
import type { RecordComment } from "../../types/recordTypes";
export declare const updateComment: (commentForm: RecordComment, requestSession: expressSession.Session) => Promise<boolean>;
export default updateComment;
