import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:updateRecordUserTypeIsActive");
export const updateRecordUserTypeIsActive = async (recordUserTypeKey, isActive) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        await pool.request()
            .input("isActive", isActive)
            .input("recordUserTypeKey", recordUserTypeKey)
            .query("update CR.RecordUserTypes" +
            " set isActive = @isActive" +
            " where recordUserTypeKey = @recordUserTypeKey");
        return true;
    }
    catch (error) {
        debugSQL(error);
        return false;
    }
};
export default updateRecordUserTypeIsActive;
