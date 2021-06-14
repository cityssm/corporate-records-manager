import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import setRecordTags from "./setRecordTags.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:createRecord");
export const createRecord = async (recordForm, reqSession) => {
    let recordID;
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const result = await pool.request()
            .input("recordTypeKey", recordForm.recordTypeKey)
            .input("recordNumber", recordForm.recordNumber)
            .input("recordTitle", recordForm.recordTitle)
            .input("recordDescription", recordForm.recordDescription)
            .input("party", recordForm.party)
            .input("location", recordForm.location)
            .input("recordDate", recordForm.recordDateString)
            .input("recordCreate_userName", reqSession.user.userName)
            .input("recordUpdate_userName", reqSession.user.userName)
            .query("insert into CR.Records" +
            " (recordTypeKey, recordNumber," +
            " recordTitle, recordDescription, party, location, recordDate," +
            " recordCreate_userName, recordUpdate_userName)" +
            " output inserted.recordID" +
            " values (@recordTypeKey, @recordNumber, @recordTitle, @recordDescription, @party, @location, @recordDate," +
            " @recordCreate_userName, @recordUpdate_userName)");
        if (!result.recordset || result.recordset.length === 0) {
            return null;
        }
        recordID = result.recordset[0].recordID;
        await setRecordTags(recordID, recordForm.tags);
    }
    catch (e) {
        debugSQL(e);
    }
    return recordID;
};
export default createRecord;
