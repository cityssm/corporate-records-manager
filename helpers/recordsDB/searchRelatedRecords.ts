import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type { Record } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:searchRelatedRecords");


export const searchRelatedRecords = async (recordID: number | string, recordTypeKey: string, searchString: string): Promise<Record[]> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    let request = pool.request()
      .input("recordID", recordID);

    let sql = "select top 100" +
      " recordID, recordTypeKey, recordNumber," +
      " recordTitle, recordDescription," +
      " party, location," +
      " recordCreate_userName, recordCreate_datetime," +
      " recordUpdate_userName, recordUpdate_datetime" +
      " from CR.Records" +
      " where recordDelete_datetime is null" +
      " and recordID <> @recordID" +
      " and recordID not in (select recordID_A from CR.RelatedRecords where recordID_B = @recordID)" +
      " and recordID not in (select recordID_B from CR.RelatedRecords where recordID_A = @recordID)";

    if (recordTypeKey !== "") {
      request = request.input("recordTypeKey", recordTypeKey);
      sql += " and recordTypeKey = @recordTypeKey";
    }

    if (searchString !== "") {

      const searchStringSplit = searchString.trim().split(" ");

      for (const [index, element] of searchStringSplit.entries()) {

        const inputKey = "searchString" + index.toString();

        request = request.input(inputKey, element);

        sql += " and (" +
          "recordNumber like '%' + @" + inputKey + " + '%'" +
          " or recordTitle like '%' + @" + inputKey + " + '%'" +
          " or recordDescription like '%' + @" + inputKey + " + '%'" +
          " or party like '%' + @" + inputKey + " + '%'" +
          " or location like '%' + @" + inputKey + " + '%'" +
          ")";
      }
    }

    const result = await request.query(sql);

    if (!result.recordset || result.recordset.length === 0) {
      return [];
    }

    const records: Record[] = result.recordset;

    return records;

  } catch (error) {
    debugSQL(error);
  }
};


export default searchRelatedRecords;
