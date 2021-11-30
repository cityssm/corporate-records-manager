import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getRecordUsers");
export const getRecordUsers = async (recordID) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const result = await pool.request()
            .input("recordID", recordID)
            .query("select recordUserID, recordID, userName, recordUserTypeKey" +
            " from CR.RecordUsers" +
            " where recordID = @recordID" +
            " and recordDelete_datetime is null" +
            " order by userName");
        if (result.recordset && result.recordset.length > 0) {
            return result.recordset;
        }
    }
    catch (error) {
        debugSQL(error);
    }
    return [];
};
export default getRecordUsers;
