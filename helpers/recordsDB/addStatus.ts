import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type * as expressSession from "express-session";
import type { RecordStatus } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:addStatus");


export const addStatus = async (statusForm: RecordStatus, reqSession: expressSession.Session): Promise<number> => {

  let statusLogID: number = null;

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    const statusTime = new Date(statusForm.statusDateString + " " + statusForm.statusTimeString);

    const result = await pool.request()
      .input("recordID", statusForm.recordID)
      .input("statusTypeKey", statusForm.statusTypeKey)
      .input("statusTime", statusTime)
      .input("statusLog", statusForm.statusLog)
      .input("recordCreate_userName", reqSession.user.userName)
      .input("recordUpdate_userName", reqSession.user.userName)
      .query("insert into CR.RecordStatusLog" +
        " (recordID, statusTypeKey," +
        " statusTime, statusLog," +
        " recordCreate_userName, recordUpdate_userName)" +
        " output inserted.statusLogID" +
        " values (@recordID, @statusTypeKey, @statusTime, @statusLog," +
        " @recordCreate_userName, @recordUpdate_userName)");

    if (!result.recordset || result.recordset.length === 0) {
      return null;
    }

    statusLogID = result.recordset[0].statusLogID;

  } catch (e) {
    debugSQL(e);
  }

  return statusLogID;
};


export default addStatus;
