import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type { RecordUserType } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getRecordUserTypes");


export const getRecordUserTypes = async (includeCounts = false): Promise<RecordUserType[]> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    let sql = "select recordUserTypeKey, recordUserType, isActive" +
      " from CR.RecordUserTypes" +
      " order by recordUserType";

    if (includeCounts) {
      sql = "select t.recordUserTypeKey, t.recordUserType, t.isActive," +
        " count(u.recordUserID) as recordCount" +
        " from CR.RecordUserTypes t" +
        " left join CR.RecordUsers u on t.recordUserTypeKey = u.recordUserTypeKey" +
        " group by t.recordUserTypeKey, t.recordUserType, t.isActive" +
        " order by t.recordUserType";
    }

    const result = await pool.request()
      .query(sql);

    if (result.recordset && result.recordset.length > 0) {
      return result.recordset;
    }

  } catch (error) {
    debugSQL(error);
  }

  return [];
};


export default getRecordUserTypes;
