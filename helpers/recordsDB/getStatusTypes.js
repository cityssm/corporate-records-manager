import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getStatusTypes");
export const getStatusTypes = async (recordTypeKey) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const result = await pool.request()
            .input("recordTypeKey", recordTypeKey)
            .query("select statusTypeKey, statusType, isActive" +
            " from CR.StatusTypes" +
            " where recordTypeKey = @recordTypeKey" +
            " order by orderNumber, statusType");
        if (result.recordset && result.recordset.length > 0) {
            return result.recordset;
        }
    }
    catch (error) {
        debugSQL(error);
    }
    return [];
};
export default getStatusTypes;
