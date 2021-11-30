import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:addRecordUser");
export const addRecordUser = async (recordUserForm, requestSession) => {
    let recordUserID;
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const result = await pool.request()
            .input("recordID", recordUserForm.recordID)
            .input("userName", recordUserForm.userName)
            .input("recordUserTypeKey", recordUserForm.recordUserTypeKey)
            .input("recordCreate_userName", requestSession.user.userName)
            .input("recordUpdate_userName", requestSession.user.userName)
            .query("insert into CR.RecordUsers" +
            " (recordID, userName, recordUserTypeKey," +
            " recordCreate_userName, recordUpdate_userName)" +
            " output inserted.recordUserID" +
            " values (@recordID, @userName, @recordUserTypeKey," +
            " @recordCreate_userName, @recordUpdate_userName)");
        if (!result.recordset || result.recordset.length === 0) {
            return undefined;
        }
        recordUserID = result.recordset[0].recordUserID;
    }
    catch (error) {
        debugSQL(error);
    }
    return recordUserID;
};
export default addRecordUser;
