import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:updateRecordUserTypeIsActive");


export const updateRecordUserTypeIsActive = async (recordUserTypeKey: string, isActive: boolean): Promise<boolean> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    await pool.request()
      .input("isActive", isActive)
      .input("recordUserTypeKey", recordUserTypeKey)
      .query("update CR.RecordUserTypes" +
        " set isActive = @isActive" +
        " where recordUserTypeKey = @recordUserTypeKey");

    return true;

  } catch (error) {
    debugSQL(error);
    return false;
  }
};


export default updateRecordUserTypeIsActive;
