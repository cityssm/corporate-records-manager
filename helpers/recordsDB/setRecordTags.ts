import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:setRecordTags");


export const setRecordTags = async (recordID: number, recordTags: string | string[]): Promise<boolean> => {

  const tags = (typeof recordTags === "string" ? [recordTags] : recordTags);

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    await pool.request()
      .input("recordID", recordID)
      .query("delete from CR.RecordTags" +
        " where recordID = @recordID");

    for (const tag of tags) {

      await pool.request()
        .input("recordID", recordID)
        .input("tag", tag)
        .query("insert into CR.RecordTags" +
          " (recordID, tag)" +
          " values (@recordID, @tag)");
    }

  } catch (e) {
    debugSQL(e);
    return false;
  }

  return true;
};


export default setRecordTags;
