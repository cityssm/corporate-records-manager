import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import { ensureInteger } from "../numberFns.js";

import type * as sqlTypes from "mssql";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:addRelatedRecord");


export const addRelatedRecord = async (recordIDA: number | string, recordIDB: number | string): Promise<boolean> => {

  const recordIDA_number = ensureInteger(recordIDA);
  const recordIDB_number = ensureInteger(recordIDB);

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    await pool.request()
      .input("recordID_A", Math.min(recordIDA_number, recordIDB_number))
      .input("recordID_B", Math.max(recordIDA_number, recordIDB_number))
      .query("insert into CR.RelatedRecords" +
        " (recordID_A, recordID_B)" +
        " values (@recordID_A, @recordID_B)");

    return true;

  } catch (error) {
    debugSQL(error);
  }

  return false;
};


export default addRelatedRecord;
