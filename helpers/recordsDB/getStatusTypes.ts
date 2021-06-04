import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type { StatusType } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getStatusTypes");


export const getStatusTypes = async (recordTypeKey: string): Promise<StatusType[]> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    const result = await pool.request()
      .input("recordTypeKey", recordTypeKey)
      .query("select statusTypeKey, statusType, isActive" +
        " from CR.StatusTypes" +
        " where recordTypeKey = @recordTypeKey" +
        " order by orderNumber, statusType");

    if (result.recordset && result.recordset.length > 0) {
      return result.recordset;
    }

  } catch (e) {
    debugSQL(e);
  }

  return [];
};


export default getStatusTypes;
