import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getRecordTypes");
export const getRecordTypes = async (includeCounts = false) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        let sql = "select recordTypeKey, recordType," +
            " minlength, maxlength, pattern, patternHelp, isActive" +
            " from CR.RecordTypes" +
            " order by recordType";
        if (includeCounts) {
            sql = "select t.recordTypeKey, t.recordType," +
                " t.minlength, t.maxlength, t.pattern, t.patternHelp, t.isActive," +
                " count(r.recordID) as recordCount" +
                " from CR.RecordTypes t" +
                " left join CR.Records r on t.recordTypeKey = r.recordTypeKey" +
                " group by t.recordTypeKey, t.recordType, t.minlength, t.maxlength, t.pattern, t.patternHelp, t.isActive" +
                " order by t.recordType";
        }
        const result = await pool.request()
            .query(sql);
        if (result.recordset && result.recordset.length > 0) {
            return result.recordset;
        }
    }
    catch (error) {
        debugSQL(error);
    }
    return [];
};
export default getRecordTypes;
