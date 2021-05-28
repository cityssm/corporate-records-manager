import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type { RecordType } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getUser");


export const getRecordTypes = async (): Promise<RecordType[]> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    const result = await pool.request()
      .query("select recordTypeKey, recordType, isActive" +
        " from CR.RecordTypes" +
        " order by recordType");

    if (result.recordset && result.recordset.length > 0) {
      return result.recordset;
    }

  } catch (e) {
    debugSQL(e);
  }

  return [];
};


export default getRecordTypes;
