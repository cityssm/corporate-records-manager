import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import setRecordTags from "./setRecordTags.js";

import type * as sqlTypes from "mssql";
import type * as expressSession from "express-session";
import type { Record } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:createRecord");


export const createRecord = async (recordForm: Record, reqSession: expressSession.Session): Promise<number> => {

  let recordID: number;

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    const result = await pool.request()
      .input("recordTypeKey", recordForm.recordTypeKey)
      .input("recordNumber", recordForm.recordNumber)
      .input("recordTitle", recordForm.recordTitle)
      .input("recordDescription", recordForm.recordDescription)
      .input("recordCreate_userName", reqSession.user.userName)
      .input("recordUpdate_userName", reqSession.user.userName)
      .query("insert into CR.Records" +
        " (recordTypeKey, recordNumber," +
        " recordTitle, recordDescription," +
        " recordCreate_userName, recordUpdate_userName)" +
        " output inserted.recordID" +
        " values (@recordTypeKey, @recordNumber, @recordTitle, @recordDescription," +
        " @recordCreate_userName, @recordUpdate_userName)");

    if (!result.recordset || result.recordset.length === 0) {
      return null;
    }

    recordID = result.recordset[0].recordID;

    await setRecordTags(recordID, recordForm.tags)

  } catch (e) {
    debugSQL(e);
  }

  return recordID;
};


export default createRecord;
