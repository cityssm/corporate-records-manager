import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:addComment");
export const addComment = async (commentForm, requestSession) => {
    let commentLogID;
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const commentTime = new Date(commentForm.commentDateString + " " + commentForm.commentTimeString);
        const result = await pool.request()
            .input("recordID", commentForm.recordID)
            .input("commentTime", commentTime)
            .input("comment", commentForm.comment)
            .input("recordCreate_userName", requestSession.user.userName)
            .input("recordUpdate_userName", requestSession.user.userName)
            .query("insert into CR.RecordCommentLog" +
            " (recordID, commentTime, comment," +
            " recordCreate_userName, recordUpdate_userName)" +
            " output inserted.commentLogID" +
            " values (@recordID, @commentTime, @comment," +
            " @recordCreate_userName, @recordUpdate_userName)");
        if (!result.recordset || result.recordset.length === 0) {
            return undefined;
        }
        commentLogID = result.recordset[0].commentLogID;
    }
    catch (error) {
        debugSQL(error);
    }
    return commentLogID;
};
export default addComment;
