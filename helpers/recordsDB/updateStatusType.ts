import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type { StatusType } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:updateStatusType");


export const updateStatusType = async (statusType: StatusType): Promise<boolean> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    await pool.request()
      .input("statusType", statusType.statusType)
      .input("statusTypeKey", statusType.statusTypeKey)
      .query("update CR.StatusTypes" +
        " set statusType = @statusType" +
        " where statusTypeKey = @statusTypeKey");

    return true;

  } catch (e) {
    debugSQL(e);
  }

  return false;
};


export default updateStatusType;
