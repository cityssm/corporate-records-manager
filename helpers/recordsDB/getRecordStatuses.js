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
            " where recordID = @recordID" +
            " and recordDelete_datetime is null" +
            " order by statusTime desc");
        if (result.recordset && result.recordset.length > 0) {
            return result.recordset;
        }
    }
    catch (error) {
        debugSQL(error);
    }
    return [];
};
export default getRecordStatuses;
