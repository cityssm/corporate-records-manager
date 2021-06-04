import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getRecordURLs");
export const getRecordURLs = async (recordID) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const result = await pool.request()
            .input("recordID", recordID)
            .query("select urlID, url, urlTitle, urlDescription" +
            " from CR.RecordURLs" +
            " where recordID = @recordID" +
            " and recordDelete_datetime is null");
        if (result.recordset && result.recordset.length > 0) {
            return result.recordset;
        }
    }
    catch (e) {
        debugSQL(e);
    }
    return [];
};
export default getRecordURLs;
