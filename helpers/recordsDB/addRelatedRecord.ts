import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:addRelatedRecord");


export const addRelatedRecord = async (recordIDA: number | string, recordIDB: number | string): Promise<boolean> => {

  const recordIDA_num = typeof (recordIDA) === "number" ? recordIDA : parseInt(recordIDA, 10);
  const recordIDB_num = typeof (recordIDB) === "number" ? recordIDB : parseInt(recordIDB, 10);

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    await pool.request()
      .input("recordID_A", Math.min(recordIDA_num, recordIDB_num))
      .input("recordID_B", Math.max(recordIDA_num, recordIDB_num))
      .query("insert into CR.RelatedRecords" +
        " (recordID_A, recordID_B)" +
        " values (@recordID_A, @recordID_B)");

    return true;

  } catch (e) {
    debugSQL(e);
  }

  return false;
};


export default addRelatedRecord;
