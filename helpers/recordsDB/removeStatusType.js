import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:removeStatusType");
export const removeStatusType = async (statusTypeKey) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const result = await pool.request()
            .input("statusTypeKey", statusTypeKey)
            .query("delete" +
            " from CR.StatusTypes" +
            " where statusTypeKey = @statusTypeKey" +
            " and statusTypeKey not in (select statusTypeKey from CR.RecordStatusLog)");
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
export default removeStatusType;
