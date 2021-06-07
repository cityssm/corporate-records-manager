import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getRelatedRecords");
export const getRelatedRecords = async (recordID) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const result = await pool.request()
            .input("recordID", recordID)
            .query("select recordID, recordTypeKey, recordNumber," +
            " recordTitle, recordDescription," +
            " recordCreate_userName, recordCreate_datetime," +
            " recordUpdate_userName, recordUpdate_datetime" +
            " from CR.Records" +
            " where recordDelete_datetime is null" +
            (" and (" +
                "recordID in (select recordID_A from CR.RelatedRecords where recordID_B = @recordID)" +
                " or recordID in (select recordID_B from CR.RelatedRecords where recordID_A = @recordID)" +
                ")"));
        if (!result.recordset || result.recordset.length === 0) {
            return [];
        }
        const records = result.recordset;
        return records;
    }
    catch (e) {
        debugSQL(e);
    }
};
export default getRelatedRecords;
