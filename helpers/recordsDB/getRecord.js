import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import { getRecordTags } from "./getRecordTags.js";
import { getRecordStatuses } from "./getRecordStatuses.js";
import { getRecordURLs } from "./getRecordURLs.js";
import { getRelatedRecords } from "./getRelatedRecords.js";
import { getRecordComments } from "./getRecordComments.js";
import { getRecordUsers } from "./getRecordUsers.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getRecord");
export const getRecord = async (recordID, requestSession) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        let sql = "select recordID, recordTypeKey, recordNumber," +
            " recordTitle, recordDescription, party, location, recordDate," +
            " recordCreate_userName, recordCreate_datetime," +
            " recordUpdate_userName, recordUpdate_datetime" +
            " from CR.Records" +
            " where recordDelete_datetime is null" +
            " and recordID = @recordID";
        if (!requestSession.user.canViewAll) {
            sql += " and recordID in (select recordID from CR.RecordUsers where userName = @userName and recordDelete_datetime is null)";
        }
        const result = await pool.request()
            .input("recordID", recordID)
            .input("userName", requestSession.user.userName)
            .query(sql);
        if (!result.recordset || result.recordset.length === 0) {
            return undefined;
        }
        const record = result.recordset[0];
        record.tags = await getRecordTags(recordID);
        record.statuses = await getRecordStatuses(recordID);
        record.urls = await getRecordURLs(recordID);
        record.related = await getRelatedRecords(recordID);
        record.comments = await getRecordComments(recordID);
        record.users = await getRecordUsers(recordID);
        return record;
    }
    catch (error) {
        debugSQL(error);
    }
};
export default getRecord;
