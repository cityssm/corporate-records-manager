import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type { RecordUserType } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getRecordUserTypes");


export const getRecordUserTypes = async (): Promise<RecordUserType[]> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    const result = await pool.request()
      .query("select recordUserTypeKey, recordUserType, isActive" +
        " from CR.RecordUserTypes" +
        " order by orderNumber, recordUserType");

    if (result.recordset && result.recordset.length > 0) {
      return result.recordset;
    }

  } catch (error) {
    debugSQL(error);
  }

  return [];
};


export default getRecordUserTypes;
