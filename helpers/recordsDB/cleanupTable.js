import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:cleanuTable");
const cleanupTable = async (tableName) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const result = await pool.request()
            .query("delete" +
            " from CR." + tableName +
            " output deleted.recordID" +
            " where recordDelete_datetime is not null" +
            " or recordID in (select recordID from CR.Records where recordDelete_datetime is not null)");
        if (result.recordset && result.recordset.length > 0) {
            return result.recordset.length;
        }
    }
    catch (error) {
        debugSQL(error);
    }
    return 0;
};
export const cleanupRecordStatusLogTable = async () => {
    return await cleanupTable("RecordStatusLog");
};
export const cleanupRecordURLsTable = async () => {
    return await cleanupTable("RecordURLs");
};
export const cleanupRecordCommentLogTable = async () => {
    return await cleanupTable("RecordCommentLog");
};
