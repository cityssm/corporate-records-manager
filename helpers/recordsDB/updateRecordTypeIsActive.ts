import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:updateRecordTypeIsActive");


export const updateRecordTypeIsActive = async (recordTypeKey: string, isActive: boolean): Promise<boolean> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    await pool.request()
      .input("isActive", isActive)
      .input("recordTypeKey", recordTypeKey)
      .query("update CR.RecordTypes" +
        " set isActive = @isActive" +
        " where recordTypeKey = @recordTypeKey");

    return true;

  } catch (e) {
    debugSQL(e);
    return false;
  }
};


export default updateRecordTypeIsActive;
