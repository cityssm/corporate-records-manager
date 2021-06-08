import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import clearRecordTags from "./clearRecordTags.js";
import setRecordTags from "./setRecordTags.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:updateRecord");
export const updateRecord = async (recordForm, reqSession) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        await pool.request()
            .input("recordTypeKey", recordForm.recordTypeKey)
            .input("recordNumber", recordForm.recordNumber)
            .input("recordTitle", recordForm.recordTitle)
            .input("recordDescription", recordForm.recordDescription)
            .input("recordDate", recordForm.recordDateString)
            .input("recordUpdate_userName", reqSession.user.userName)
            .input("recordUpdate_datetime", new Date())
            .input("recordID", recordForm.recordID)
            .query("update CR.Records" +
            " set recordTypeKey = @recordTypeKey," +
            " recordNumber = @recordNumber," +
            " recordTitle = @recordTitle," +
            " recordDescription = @recordDescription," +
            " recordDate = @recordDate," +
            " recordUpdate_userName = @recordUpdate_userName," +
            " recordUpdate_datetime = @recordUpdate_datetime" +
            " where recordDelete_datetime is null" +
            " and recordID = @recordID");
        await clearRecordTags(recordForm.recordID);
        await setRecordTags(recordForm.recordID, recordForm.tags);
        return true;
    }
    catch (e) {
        debugSQL(e);
        return false;
    }
};
export default updateRecord;
