import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getRecordTypes");
export const getRecordTypes = async () => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const result = await pool.request()
            .query("select recordTypeKey, recordType, minlength, maxlength, pattern, patternHelp, isActive" +
            " from CR.RecordTypes" +
            " order by recordType");
        if (result.recordset && result.recordset.length > 0) {
            return result.recordset;
        }
    }
    catch (e) {
        debugSQL(e);
    }
    return [];
};
export default getRecordTypes;
