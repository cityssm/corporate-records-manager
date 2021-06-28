import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:cleanupRelatedRecordsTable");
export const cleanupRelatedRecordsTable = async () => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const result = await pool.request()
            .query("delete" +
            " from CR.RelatedRecords" +
            " output deleted.recordID_A" +
            " where recordID_A in (select recordID from CR.Records where recordDelete_datetime is not null)" +
            " or recordID_B in (select recordID from CR.Records where recordDelete_datetime is not null)");
        if (result.recordset && result.recordset.length > 0) {
            return result.recordset.length;
        }
    }
    catch (e) {
        debugSQL(e);
    }
    return 0;
};
export default cleanupRelatedRecordsTable;
