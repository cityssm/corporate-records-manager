import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:updateComment");
export const updateComment = async (commentForm, reqSession) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const commentTime = new Date(commentForm.commentDateString + " " + commentForm.commentTimeString);
        await pool.request()
            .input("commentTime", commentTime)
            .input("comment", commentForm.comment)
            .input("recordUpdate_userName", reqSession.user.userName)
            .input("recordUpdate_datetime", new Date())
            .input("commentLogID", commentForm.commentLogID)
            .query("update CR.RecordCommentLog" +
            " set commentTime = @commentTime," +
            " comment = @comment," +
            " recordUpdate_userName = @recordUpdate_userName," +
            " recordUpdate_datetime = @recordUpdate_datetime" +
            " where commentLogID = @commentLogID" +
            " and recordDelete_datetime is null");
        return true;
    }
    catch (e) {
        debugSQL(e);
    }
    return false;
};
export default updateComment;
