import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type { RecordType } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:addRecordType");


export const addRecordType = async (recordType: RecordType): Promise<boolean> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    await pool.request()
      .input("recordTypeKey", recordType.recordTypeKey)
      .input("recordType", recordType.recordType)
      .input("minlength", recordType.minlength)
      .input("maxlength", recordType.maxlength)
      .input("pattern", recordType.pattern)
      .input("patternHelp", recordType.patternHelp)
      .input("isActive", recordType.isActive)
      .query("insert into CR.RecordTypes" +
        " (recordTypeKey, recordType," +
        " minlength, maxlength, pattern, patternHelp," +
        " isActive)" +
        " values (@recordTypeKey, @recordType," +
        " @minlength, @maxlength, @pattern, @patternHelp," +
        " @isActive)");

    return true;

  } catch (e) {
    debugSQL(e);
  }

  return false;
};


export default addRecordType;
