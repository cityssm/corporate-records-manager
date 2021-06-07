import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:removeComment");
export const removeComment = async (commentLogID, reqSession) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        await pool.request()
            .input("recordDelete_userName", reqSession.user.userName)
            .input("recordDelete_datetime", new Date())
            .input("commentLogID", commentLogID)
            .query("update CR.RecordCommentLog" +
            " set recordDelete_userName = @recordDelete_userName," +
            " recordDelete_datetime = @recordDelete_datetime" +
            " where recordDelete_datetime is null" +
            " and commentLogID = @commentLogID");
        return true;
    }
    catch (e) {
        debugSQL(e);
        return false;
    }
};
export default removeComment;
