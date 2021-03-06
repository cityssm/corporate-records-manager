import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:cleanuTable");


const cleanupTable = async (tableName: string): Promise<number> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    const result = await pool.request()
      .query("delete" +
        " from CR." + tableName +
        " output deleted.recordID" +
        " where recordDelete_datetime is not null" +
        " or recordID in (select recordID from CR.Records where recordDelete_datetime is not null)");

    if (result.recordset && result.recordset.length > 0) {
      return result.recordset.length;
    }

  } catch (error) {
    debugSQL(error);
  }

  return 0;
};


export const cleanupRecordStatusLogTable = async (): Promise<number> => {
  return await cleanupTable("RecordStatusLog");
};

export const cleanupRecordUsersTable = async (): Promise<number> => {
  return await cleanupTable("RecordUsers");
};

export const cleanupRecordURLsTable = async (): Promise<number> => {
  return await cleanupTable("RecordURLs");
};

export const cleanupRecordCommentLogTable = async (): Promise<number> => {
  return await cleanupTable("RecordCommentLog");
};
