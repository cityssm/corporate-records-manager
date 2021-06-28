import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:cleanupRecordsTable");
export const cleanupRecordsTable = async () => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        await pool.request()
            .query("delete" +
            " from CR.RelatedRecords" +
            " where recordID_A in (select recordID from CR.Records where recordDelete_datetime is not null)" +
            " or recordID_B in (select recordID from CR.Records where recordDelete_datetime is not null)");
        const result = await pool.request()
            .query("delete" +
            " from CR.Records" +
            " output deleted.recordID" +
            " where recordDelete_datetime is not null" +
            " and recordID not in (select recordID from CR.RecordTags)" +
            " and recordID not in (select recordID from CR.RecordStatusLog)" +
            " and recordID not in (select recordID from CR.RecordURLs)" +
            " and recordID not in (select recordID_A from CR.RelatedRecords)" +
            " and recordID not in (select recordID_B from CR.RelatedRecords)" +
            " and recordID not in (select recordID from CR.RecordCommentLog)");
        if (result.recordset && result.recordset.length > 0) {
            return result.recordset.length;
        }
    }
    catch (e) {
        debugSQL(e);
    }
    return 0;
};
export default cleanupRecordsTable;
