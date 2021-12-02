import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type * as expressSession from "express-session";
import type { RecordUser } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:addRecordUser");


export const addRecordUser = async (recordUserForm: RecordUser, requestSession: expressSession.Session): Promise<number> => {

  let recordUserID: number;

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    let result = await pool.request()
      .input("recordID", recordUserForm.recordID)
      .input("userName", recordUserForm.userName)
      .query("select recordUserID, recordDelete_datetime" +
        " from CR.RecordUsers" +
        " where recordID = @recordID" +
        " and userName = @userName");

    if (result.recordset && result.recordset.length > 0) {

      const recordDelete_datetime = result.recordset[0].recordDelete_datetime as Date;

      if (!recordDelete_datetime) {
        return undefined;
      }

      recordUserID = result.recordset[0].recordUserID;

      result = await pool.request()
        .input("recordUserID", recordUserID)
        .input("recordUserTypeKey", recordUserForm.recordUserTypeKey)
        .input("recordCreate_userName", requestSession.user.userName)
        .input("recordUpdate_userName", requestSession.user.userName)
        .query("update CR.RecordUsers" +
          " set recordCreate_userName = @recordCreate_userName," +
          " recordCreate_datetime = getdate()," +
          " recordUpdate_userName = @recordUpdate_userName," +
          " recordUpdate_datetime = getdate()," +
          " recordDelete_datetime = null," +
          " recordDelete_userName = null" +
          " where recordUserID = @recordUserID");

    } else {

      result = await pool.request()
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

  } catch (error) {
    debugSQL(error);
  }

  return recordUserID;
};


export default addRecordUser;
