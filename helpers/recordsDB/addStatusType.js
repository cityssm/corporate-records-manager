import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:addStatusType");
export const addStatusType = async (statusType) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        await pool.request()
            .input("recordTypeKey", statusType.recordTypeKey)
            .input("orderNumber", statusType.orderNumber || 0)
            .query("update CR.StatusTypes" +
            " set orderNumber = @orderNumber + 1" +
            " where recordTypeKey = @recordTypeKey" +
            " and orderNumber >= @orderNumber");
        await pool.request()
            .input("statusTypeKey", statusType.statusTypeKey)
            .input("recordTypeKey", statusType.recordTypeKey)
            .input("statusType", statusType.statusType)
            .input("isActive", statusType.isActive)
            .input("orderNumber", statusType.orderNumber || 0)
            .query("insert into CR.StatusTypes" +
            " (statusTypeKey, recordTypeKey, statusType," +
            " isActive, orderNumber)" +
            " values (@statusTypeKey, @recordTypeKey, @statusType," +
            " @isActive, @orderNumber)");
        return true;
    }
    catch (e) {
        debugSQL(e);
    }
    return false;
};
export default addStatusType;
