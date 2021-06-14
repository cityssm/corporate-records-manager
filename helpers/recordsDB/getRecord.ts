import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import getRecordTags from "./getRecordTags.js";
import getRecordStatuses from "./getRecordStatuses.js";
import getRecordURLs from "./getRecordURLs.js";
import getRelatedRecords from "./getRelatedRecords.js";
import getRecordComments from "./getRecordComments.js";

import type * as sqlTypes from "mssql";
import type { Record } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getRecord");


export const getRecord = async (recordID: number | string): Promise<Record> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    const result = await pool.request()
      .input("recordID", recordID)
      .query("select recordID, recordTypeKey, recordNumber," +
        " recordTitle, recordDescription, party, location, recordDate," +
        " recordCreate_userName, recordCreate_datetime," +
        " recordUpdate_userName, recordUpdate_datetime" +
        " from CR.Records" +
        " where recordDelete_datetime is null" +
        " and recordID = @recordID");

    if (!result.recordset || result.recordset.length === 0) {
      return null;
    }

    const record: Record = result.recordset[0];

    record.tags = await getRecordTags(recordID);
    record.statuses = await getRecordStatuses(recordID);
    record.urls = await getRecordURLs(recordID);
    record.related = await getRelatedRecords(recordID);
    record.comments = await getRecordComments(recordID);

    return record;

  } catch (e) {
    debugSQL(e);
  }
};


export default getRecord;
