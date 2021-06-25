import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:removeStatusType");


export const removeStatusType = async (statusTypeKey: string): Promise<boolean> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    const result = await pool.request()
      .input("statusTypeKey", statusTypeKey)
      .query("delete" +
        " from CR.StatusTypes" +
        " where statusTypeKey = @statusTypeKey" +
        " and statusTypeKey not in (select statusTypeKey from CR.RecordStatusLog)");

    if (result.recordset && result.recordset.length > 0) {
      return true;
    }

    return true;

  } catch (e) {
    debugSQL(e);
  }

  return false;
};


export default removeStatusType;
