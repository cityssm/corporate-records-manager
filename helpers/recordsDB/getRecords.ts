import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type { Record } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getRecords");


export const getRecords = async (params: {
  recordTypeKey: string;
  searchString: string;
}): Promise<Record[]> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    let request = pool.request();

    let sql = "select top 100" +
      " recordID, recordTypeKey, recordNumber," +
      " recordTitle, recordDescription, recordDate," +
      " recordCreate_userName, recordCreate_datetime," +
      " recordUpdate_userName, recordUpdate_datetime" +
      " from CR.Records" +
      " where recordDelete_datetime is null";

    if (params.recordTypeKey !== "") {
      request = request.input("recordTypeKey", params.recordTypeKey);
      sql += " and recordTypeKey = @recordTypeKey";
    }

    if (params.searchString !== "") {

      const searchStringSplit = params.searchString.trim().split(" ");

      for (let index = 0; index < searchStringSplit.length; index += 1) {

        const inputKey = "searchString" + index.toString();

        request = request.input(inputKey, searchStringSplit[index]);

        sql += " and (" +
          "recordNumber like '%' + @" + inputKey + " + '%'" +
          " or recordTitle like '%' + @" + inputKey + " + '%'" +
          " or recordDescription like '%' + @" + inputKey + " + '%'" +
          ")";
      }
    }

    sql += " order by recordDate desc, recordCreate_datetime desc";

    const result = await request.query(sql);

    if (!result.recordset || result.recordset.length === 0) {
      return [];
    }

    const records: Record[] = result.recordset;

    return records;

  } catch (e) {
    debugSQL(e);
  }
};


export default getRecords;
