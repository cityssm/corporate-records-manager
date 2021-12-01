import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type { RecordType } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:updateRecordType");


export const updateRecordType = async (recordType: RecordType): Promise<boolean> => {

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
      .query("update CR.RecordTypes" +
        " set recordType = @recordType," +
        " minlength = @minlength," +
        " maxlength = @maxlength," +
        " pattern = @pattern," +
        " patternHelp = @patternHelp" +
        " where recordTypeKey = @recordTypeKey");

    return true;

  } catch (error) {
    debugSQL(error);
  }

  return false;
};


export default updateRecordType;
