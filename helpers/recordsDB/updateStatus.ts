import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type * as expressSession from "express-session";
import type { RecordStatus } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:updateStatus");


export const updateStatus = async (statusForm: RecordStatus, reqSession: expressSession.Session): Promise<boolean> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    const statusTime = new Date(statusForm.statusDateString + " " + statusForm.statusTimeString);

    await pool.request()
      .input("statusTypeKey", statusForm.statusTypeKey)
      .input("statusTime", statusTime)
      .input("statusLog", statusForm.statusLog)
      .input("recordUpdate_userName", reqSession.user.userName)
      .input("recordUpdate_datetime", new Date())
      .input("statusLogID", statusForm.statusLogID)
      .query("update CR.RecordStatusLog" +
        " set statusTypeKey = @statusTypeKey," +
        " statusTime = @statusTime," +
        " statusLog = @statusLog," +
        " recordUpdate_userName = @recordUpdate_userName," +
        " recordUpdate_datetime = @recordUpdate_datetime" +
        " where statusLogID = @statusLogID" +
        " and recordDelete_datetime is null");

    return true;

  } catch (e) {
    debugSQL(e);
  }

  return false;
};


export default updateStatus;