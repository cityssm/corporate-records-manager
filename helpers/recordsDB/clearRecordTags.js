import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:clearRecordTags");
export const clearRecordTags = async (recordID) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        await pool.request()
            .input("recordID", recordID)
            .query("delete from CR.RecordTags" +
            " where recordID = @recordID");
    }
    catch (error) {
        debugSQL(error);
        return false;
    }
    return true;
};
export default clearRecordTags;
