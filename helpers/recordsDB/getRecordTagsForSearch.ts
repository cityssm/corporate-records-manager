import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getRecordTagsForSearch");


export const getRecordTagsForSearch = async (): Promise<string[]> => {

  const tags: string[] = [];

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    const result = await pool.request()
      .query("select tag" +
        " from CR.RecordTags" +
        " where recordID in (select recordID from CR.Records where recordDelete_datetime is null)" +
        " group by tag" +
        " having count(recordID) >= 5" +
        " order by round(count(recordID), -1) desc, tag");

    if (result.recordset && result.recordset.length > 0) {

      for (const row of result.recordset) {
        tags.push(row.tag);
      }
    }

  } catch (error) {
    debugSQL(error);
  }

  return tags;
};


export default getRecordTagsForSearch;
