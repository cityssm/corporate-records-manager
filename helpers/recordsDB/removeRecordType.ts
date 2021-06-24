import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:removeRecordType");


export const removeRecordType = async (recordTypeKey: string): Promise<boolean> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    await pool.request()
      .input("recordTypeKey", recordTypeKey)
      .query("delete" +
        " from CR.StatusTypes" +
        " where recordTypeKey = @recordTypeKey" +
        " and recordTypeKey not in (select recordTypeKey from CR.Records)");

    const result = await pool.request()
      .input("recordTypeKey", recordTypeKey)
      .query("delete" +
        " from CR.RecordTypes" +
        " output deleted.recordTypeKey" +
        " where recordTypeKey = @recordTypeKey" +
        " and recordTypeKey not in (select recordTypeKey from CR.Records)");

    if (result.recordset && result.recordset.length > 0) {
      return true;
    }

    return true;

  } catch (e) {
    debugSQL(e);
  }

  return false;
};


export default removeRecordType;
