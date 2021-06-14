import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:removeRelatedRecord");
export const removeRelatedRecord = async (recordIDA, recordIDB) => {
    const recordIDA_num = typeof (recordIDA) === "number" ? recordIDA : parseInt(recordIDA, 10);
    const recordIDB_num = typeof (recordIDB) === "number" ? recordIDB : parseInt(recordIDB, 10);
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        await pool.request()
            .input("recordID_A", Math.min(recordIDA_num, recordIDB_num))
            .input("recordID_B", Math.max(recordIDA_num, recordIDB_num))
            .query("delete from CR.RelatedRecords" +
            " where (recordID_A = @recordID_A and recordID_B = @recordID_B)" +
            " or (recordID_A = @recordID_B and recordID_B = @recordID_A)");
        return true;
    }
    catch (e) {
        debugSQL(e);
    }
    return false;
};
export default removeRelatedRecord;
