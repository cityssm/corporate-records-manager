import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:removeStatus");
export const removeStatus = async (statusLogID, requestSession) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        await pool.request()
            .input("recordDelete_userName", requestSession.user.userName)
            .input("recordDelete_datetime", new Date())
            .input("statusLogID", statusLogID)
            .query("update CR.RecordStatusLog" +
            " set recordDelete_userName = @recordDelete_userName," +
            " recordDelete_datetime = @recordDelete_datetime" +
            " where recordDelete_datetime is null" +
            " and statusLogID = @statusLogID");
        return true;
    }
    catch (error) {
        debugSQL(error);
        return false;
    }
};
export default removeStatus;
