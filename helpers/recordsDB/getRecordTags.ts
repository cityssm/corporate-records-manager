import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getRecordTags");


export const getRecordTags = async (recordID: number | string): Promise<string[]> => {

  const tags: string[] = [];

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    const result = await pool.request()
      .input("recordID", recordID)
      .query("select tag" +
        " from CR.RecordTags" +
        " where recordID = @recordID");

    if (result.recordset && result.recordset.length > 0) {

      for (const row of result.recordset) {
        tags.push(row.tag);
      }
    }

  } catch (error) {
    debugSQL(error);
  }

  return tags;
};


export default getRecordTags;
