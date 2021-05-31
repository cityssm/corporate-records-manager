import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import getRecordTags from "./getRecordTags.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getRecord");
export const getRecord = async (recordID) => {
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
            " and recordID = @recordID");
        if (!result.recordset || result.recordset.length === 0) {
            return null;
        }
        const record = result.recordset[0];
        record.tags = await getRecordTags(recordID);
    }
    catch (e) {
        debugSQL(e);
    }
};
export default getRecord;
