import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getRecordUserTypes");
export const getRecordUserTypes = async () => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const result = await pool.request()
            .query("select recordUserTypeKey, recordUserType, isActive" +
            " from CR.RecordUserTypes" +
            " order by orderNumber, recordUserType");
        if (result.recordset && result.recordset.length > 0) {
            return result.recordset;
        }
    }
    catch (error) {
        debugSQL(error);
    }
    return [];
};
export default getRecordUserTypes;
