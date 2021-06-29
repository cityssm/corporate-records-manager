import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import { clearRecordTags } from "./clearRecordTags.js";
import { setRecordTags } from "./setRecordTags.js";

import type * as sqlTypes from "mssql";
import type * as expressSession from "express-session";
import type { Record } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:updateRecord");


export const updateRecord = async (recordForm: Record, requestSession: expressSession.Session): Promise<boolean> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    await pool.request()
      .input("recordTypeKey", recordForm.recordTypeKey)
      .input("recordNumber", recordForm.recordNumber)
      .input("recordTitle", recordForm.recordTitle === "" ? recordForm.recordNumber : recordForm.recordTitle)
      .input("recordDescription", recordForm.recordDescription)
      .input("party", recordForm.party)
      .input("location", recordForm.location)
      .input("recordDate", recordForm.recordDateString)
      .input("recordUpdate_userName", requestSession.user.userName)
      .input("recordUpdate_datetime", new Date())
      .input("recordID", recordForm.recordID)
      .query("update CR.Records" +
        " set recordTypeKey = @recordTypeKey," +
        " recordNumber = @recordNumber," +
        " recordTitle = @recordTitle," +
        " recordDescription = @recordDescription," +
        " party = @party," +
        " location = @location," +
        " recordDate = @recordDate," +
        " recordUpdate_userName = @recordUpdate_userName," +
        " recordUpdate_datetime = @recordUpdate_datetime" +
        " where recordDelete_datetime is null" +
        " and recordID = @recordID");

    await clearRecordTags(recordForm.recordID);
    await setRecordTags(recordForm.recordID, recordForm.tags);

    return true;

  } catch (error) {
    debugSQL(error);
    return false;
  }
};


export default updateRecord;
