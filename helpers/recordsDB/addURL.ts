import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import setRecordTags from "./setRecordTags.js";

import type * as sqlTypes from "mssql";
import type * as expressSession from "express-session";
import type { RecordURL } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:addURL");


export const addURL = async (urlForm: RecordURL, reqSession: expressSession.Session): Promise<number> => {

  let urlID: number = null;

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    const result = await pool.request()
      .input("recordID", urlForm.recordID)
      .input("url", urlForm.url)
      .input("urlTitle", urlForm.urlTitle)
      .input("urlDescription", urlForm.urlDescription)
      .input("recordCreate_userName", reqSession.user.userName)
      .input("recordUpdate_userName", reqSession.user.userName)
      .query("insert into CR.RecordURLs" +
        " (recordID, url," +
        " urlTitle, urlDescription," +
        " recordCreate_userName, recordUpdate_userName)" +
        " output inserted.urlID" +
        " values (@recordID, @url, @urlTitle, @urlDescription," +
        " @recordCreate_userName, @recordUpdate_userName)");

    if (!result.recordset || result.recordset.length === 0) {
      return null;
    }

    urlID = result.recordset[0].urlID;

  } catch (e) {
    debugSQL(e);
  }

  return urlID;
};


export default addURL;
