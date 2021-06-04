import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type * as expressSession from "express-session";
import type * as recordTypes from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:updateURL");


export const updateURL = async (recordURL: recordTypes.RecordURL, reqSession: expressSession.Session): Promise<boolean> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    await pool.request()
      .input("url", recordURL.url)
      .input("urlTitle", recordURL.urlTitle)
      .input("urlDescription", recordURL.urlDescription)
      .input("recordUpdate_userName", reqSession.user.userName)
      .input("recordUpdate_datetime", new Date())
      .input("urlID", recordURL.urlID)
      .query("update CR.RecordURLs" +
        " set url = @url," +
        " urlTitle = @urlTitle," +
        " urlDescription = @urlDescription," +
        " recordUpdate_userName = @recordUpdate_userName," +
        " recordUpdate_datetime = @recordUpdate_datetime" +
        " where recordDelete_datetime is null" +
        " and urlID = @urlID");

    return true;

  } catch (e) {
    debugSQL(e);
    return false;
  }
};


export default updateURL;
