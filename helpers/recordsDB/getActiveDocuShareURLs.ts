import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as recordTypes from "../../types/recordTypes";
import type * as sqlTypes from "mssql";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getActiveDocuShareURLs");


export const getActiveDocuShareURLs = async (): Promise<recordTypes.DocuShareRecordURL[]> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    const result = await pool.request()
      .input("docuShareRootURL", configFns.getProperty("integrations.docuShare.rootURL"))
      .query("select r.recordID, r.recordTypeKey, r.recordNumber," +
        " u.urlID, u.url" +
        " from CR.Records r" +
        " left join CR.RecordURLs u on r.recordID = u.recordID" +
        " where r.recordDelete_datetime is null" +
        " and u.recordDelete_datetime is null" +
        " and u.url like @docuShareRootURL + '%'");

    if (result.recordset && result.recordset.length > 0) {
      return result.recordset;
    }

  } catch (e) {
    debugSQL(e);
  }

  return [];
};


export default getActiveDocuShareURLs;
