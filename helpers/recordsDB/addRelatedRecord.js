import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import { ensureInteger } from "../numberFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:addRelatedRecord");
export const addRelatedRecord = async (recordIDA, recordIDB) => {
    const recordIDA_num = ensureInteger(recordIDA);
    const recordIDB_num = ensureInteger(recordIDB);
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        await pool.request()
            .input("recordID_A", Math.min(recordIDA_num, recordIDB_num))
            .input("recordID_B", Math.max(recordIDA_num, recordIDB_num))
            .query("insert into CR.RelatedRecords" +
            " (recordID_A, recordID_B)" +
            " values (@recordID_A, @recordID_B)");
        return true;
    }
    catch (e) {
        debugSQL(e);
    }
    return false;
};
export default addRelatedRecord;
