import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:updateRecordType");
export const updateRecordType = async (recordType) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        await pool.request()
            .input("recordTypeKey", recordType.recordTypeKey)
            .input("recordType", recordType.recordType)
            .input("minlength", recordType.minlength)
            .input("maxlength", recordType.maxlength)
            .input("pattern", recordType.pattern)
            .input("patternHelp", recordType.patternHelp)
            .input("isActive", recordType.isActive)
            .query("update CR.RecordTypes" +
            " set recordType = @recordType," +
            " minlength = @minlength," +
            " maxlength = @maxlength," +
            " pattern = @pattern," +
            " patternHelp = @patternHelp" +
            " where recordTypeKey = @recordTypeKey");
        return true;
    }
    catch (e) {
        debugSQL(e);
    }
    return false;
};
export default updateRecordType;
