import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:removeRecordUserType");
export const removeRecordUserType = async (recordUserTypeKey) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const result = await pool.request()
            .input("recordUserTypeKey", recordUserTypeKey)
            .query("delete" +
            " from CR.RecordUserTypes" +
            " where recordUserTypeKey = @recordUserTypeKey" +
            " and recordUserTypeKey not in (select recordUserTypeKey from CR.RecordUsers)");
        if (result.recordset && result.recordset.length > 0) {
            return true;
        }
        return true;
    }
    catch (error) {
        debugSQL(error);
    }
    return false;
};
export default removeRecordUserType;
