import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getRecordStatuses");
export const getRecordStatuses = async (recordID) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const result = await pool.request()
            .input("recordID", recordID)
            .query("select statusLogID, statusTypeKey, statusTime, statusLog" +
            " from CR.RecordStatusLog" +
            " where recordID = @recordID");
        if (result.recordset && result.recordset.length > 0) {
            return result.recordset;
        }
    }
    catch (e) {
        debugSQL(e);
    }
    return [];
};
export default getRecordStatuses;
