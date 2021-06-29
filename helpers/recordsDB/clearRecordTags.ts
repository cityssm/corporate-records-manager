import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:clearRecordTags");


export const clearRecordTags = async (recordID: number): Promise<boolean> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    await pool.request()
      .input("recordID", recordID)
      .query("delete from CR.RecordTags" +
        " where recordID = @recordID");


  } catch (error) {
    debugSQL(error);
    return false;
  }

  return true;
};


export default clearRecordTags;
