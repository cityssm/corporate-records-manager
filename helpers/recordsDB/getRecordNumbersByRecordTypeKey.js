import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getRecordNumbersByRecordTypeKey");
export const getRecordNumbersByRecordTypeKey = async (recordTypeKey) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const result = await pool.request()
            .input("recordTypeKey", recordTypeKey)
            .query("select recordID, recordTypeKey, recordNumber" +
            " from CR.Records" +
            " where recordDelete_datetime is null" +
            " and recordTypeKey = @recordTypeKey");
        if (!result.recordset || result.recordset.length === 0) {
            return [];
        }
        const records = result.recordset;
        return records;
    }
    catch (error) {
        debugSQL(error);
    }
};
export default getRecordNumbersByRecordTypeKey;
