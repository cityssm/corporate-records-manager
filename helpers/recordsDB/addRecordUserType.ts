import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type { RecordUserType } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:addRecordUserType");


export const addRecordUserType = async (recordUserType: RecordUserType): Promise<boolean> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    await pool.request()
      .input("recordUserTypeKey", recordUserType.recordUserTypeKey)
      .input("recordUserType", recordUserType.recordUserType)
      .input("isActive", recordUserType.isActive)
      .query("insert into CR.RecordUserTypes" +
        " (recordUserTypeKey, recordUserType, isActive)" +
        " values (@recordUserTypeKey, @recordUserType, @isActive)");

    return true;

  } catch (error) {
    debugSQL(error);
  }

  return false;
};


export default addRecordUserType;
