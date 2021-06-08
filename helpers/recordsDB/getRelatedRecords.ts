import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type { Record } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getRelatedRecords");


export const getRelatedRecords = async (recordID: number | string): Promise<Record[]> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    const result = await pool.request()
      .input("recordID", recordID)
      .query("select recordID, recordTypeKey, recordNumber," +
        " recordTitle, recordDescription, recordDate," +
        " recordCreate_userName, recordCreate_datetime," +
        " recordUpdate_userName, recordUpdate_datetime" +
        " from CR.Records" +
        " where recordDelete_datetime is null" +
        (" and (" +
          "recordID in (select recordID_A from CR.RelatedRecords where recordID_B = @recordID)" +
          " or recordID in (select recordID_B from CR.RelatedRecords where recordID_A = @recordID)" +
          ")"));

    if (!result.recordset || result.recordset.length === 0) {
      return [];
    }

    const records: Record[] = result.recordset;

    return records;

  } catch (e) {
    debugSQL(e);
  }
};


export default getRelatedRecords;
