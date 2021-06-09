import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type { Record } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getRecordNumbersByRecordTypeKey");


export const getRecordNumbersByRecordTypeKey = async (recordTypeKey: string): Promise<Record[]> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    const result = await pool.request()
      .input("recordTypeKey", recordTypeKey)
      .query("select recordID, recordTypeKey, recordNumber" +
        " from CR.Records" +
        " where recordDelete_datetime is null" +
        " and recordTypeKey = @recordTypeKey");

    if (!result.recordset || result.recordset.length === 0) {
      return [];
    }

    const records: Record[] = result.recordset;

    return records;

  } catch (e) {
    debugSQL(e);
  }
};


export default getRecordNumbersByRecordTypeKey;
