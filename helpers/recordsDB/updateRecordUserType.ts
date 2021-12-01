import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type { RecordUserType } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:updateRecordUserType");


export const updateRecordUserType = async (recordUserType: RecordUserType): Promise<boolean> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    await pool.request()
      .input("recordUserTypeKey", recordUserType.recordUserTypeKey)
      .input("recordUserType", recordUserType.recordUserType)
      .query("update CR.RecordUserTypes" +
        " set recordUserType = @recordUserType" +
        " where recordUserTypeKey = @recordUserTypeKey");

    return true;

  } catch (error) {
    debugSQL(error);
  }

  return false;
};


export default updateRecordUserType;
