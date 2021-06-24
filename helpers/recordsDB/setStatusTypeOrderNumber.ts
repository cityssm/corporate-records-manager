import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:setStatusTypeOrderNumber");


export const setStatusTypeOrderNumber = async (statusTypeKey: string, orderNumber: number, updateOtherStatusType: boolean = false): Promise<boolean> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    const result = await pool.request()
      .input("orderNumber", orderNumber)
      .input("statusTypeKey", statusTypeKey)
      .query("update CR.StatusTypes" +
        " set orderNumber = @orderNumber" +
        " output deleted.orderNumber, deleted.recordTypeKey" +
        " where statusTypeKey = @statusTypeKey");

    if (updateOtherStatusType) {

      await pool.request()
        .input("resultOrderNumber", result.recordset[0].orderNumber)
        .input("resultRecordTypeKey", result.recordset[0].recordTypeKey)
        .input("orderNumber", orderNumber)
        .input("statusTypeKey", statusTypeKey)
        .query("update CR.StatusTypes" +
          " set orderNumber = @resultOrderNumber" +
          " where recordTypeKey = @resultRecordTypeKey" +
          " and orderNumber = @orderNumber" +
          " and statusTypeKey != @statusTypeKey");
    }

    return true;

  } catch (e) {
    debugSQL(e);
  }

  return false;
};


export default setStatusTypeOrderNumber;
