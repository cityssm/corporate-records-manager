import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:cleanupRecordTagsTable");
export const cleanupRecordTagsTable = async () => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const result = await pool.request()
            .query("delete" +
            " from CR.RecordTags" +
            " output deleted.recordID" +
            " where recordID in (select recordID from CR.Records where recordDelete_datetime is not null)");
        if (result.recordset && result.recordset.length > 0) {
            return result.recordset.length;
        }
    }
    catch (error) {
        debugSQL(error);
    }
    return 0;
};
export default cleanupRecordTagsTable;
