import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type * as expressSession from "express-session";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:removeRecordUser");


export const removeRecordUser = async (recordUserID: number | string, requestSession: expressSession.Session): Promise<boolean> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    await pool.request()
      .input("recordDelete_userName", requestSession.user.userName)
      .input("recordDelete_datetime", new Date())
      .input("recordUserID", recordUserID)
      .query("update CR.RecordUsers" +
        " set recordDelete_userName = @recordDelete_userName," +
        " recordDelete_datetime = @recordDelete_datetime" +
        " where recordDelete_datetime is null" +
        " and recordUserID = @recordUserID");

    return true;

  } catch (error) {
    debugSQL(error);
    return false;
  }
};


export default removeRecordUser;
