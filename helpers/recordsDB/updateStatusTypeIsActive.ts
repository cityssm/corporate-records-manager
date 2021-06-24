import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:updateStatusTypeIsActive");


export const updateStatusTypeIsActive = async (statusTypeKey: string, isActive: boolean): Promise<boolean> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    await pool.request()
      .input("isActive", isActive)
      .input("statusTypeKey", statusTypeKey)
      .query("update CR.StatusTypes" +
        " set isActive = @isActive" +
        " where statusTypeKey = @statusTypeKey");

    return true;

  } catch (e) {
    debugSQL(e);
    return false;
  }
};


export default updateStatusTypeIsActive;
