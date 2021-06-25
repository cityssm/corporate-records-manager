import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:updateStatusType");
export const updateStatusType = async (statusType) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        await pool.request()
            .input("statusType", statusType.statusType)
            .input("statusTypeKey", statusType.statusTypeKey)
            .query("update CR.StatusTypes" +
            " set statusType = @statusType" +
            " where statusTypeKey = @statusTypeKey");
        return true;
    }
    catch (e) {
        debugSQL(e);
    }
    return false;
};
export default updateStatusType;
