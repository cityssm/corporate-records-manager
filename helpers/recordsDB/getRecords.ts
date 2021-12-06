import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type { Record, PartialSession } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getRecords");


interface GetRecordsReturn {
  count: number;
  records: Record[];
}


export const getRecords = async (parameters: {
  recordTypeKey: string;
  searchString: string;
  recordNumber?: string;
  recordTag?: string;
  recordDateStringGTE?: string;
  recordDateStringLTE?: string;
}, options: {
  limit: number;
  offset: number;
}, requestSession: PartialSession): Promise<GetRecordsReturn> => {

  const returnObject: GetRecordsReturn = {
    count: 0,
    records: []
  };

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    let countRequest = pool.request();
    let resultsRequest = pool.request();

    let whereSQL = " where recordDelete_datetime is null";

    if (!requestSession.user.canViewAll) {
      countRequest = countRequest.input("userName", requestSession.user.userName);
      resultsRequest = resultsRequest.input("userName", requestSession.user.userName);
      whereSQL += " and recordID in (select recordID from CR.RecordUsers where userName = @userName and recordDelete_datetime is null)";
    }

    if (parameters.recordTypeKey !== "") {
      countRequest = countRequest.input("recordTypeKey", parameters.recordTypeKey);
      resultsRequest = resultsRequest.input("recordTypeKey", parameters.recordTypeKey);
      whereSQL += " and recordTypeKey = @recordTypeKey";
    }

    if (parameters.recordNumber && parameters.recordNumber !== "") {
      countRequest = countRequest.input("recordNumber", parameters.recordNumber);
      resultsRequest = resultsRequest.input("recordNumber", parameters.recordNumber);
      whereSQL += " and recordNumber like '%' + @recordNumber + '%'";
    }

    if (parameters.recordTag && parameters.recordTag !== "") {
      countRequest = countRequest.input("recordTag", parameters.recordTag);
      resultsRequest = resultsRequest.input("recordTag", parameters.recordTag);
      whereSQL += " and recordID in (select recordID from CR.RecordTags where tag like '%' + @recordTag + '%')";
    }

    if (parameters.recordDateStringGTE && parameters.recordDateStringGTE !== "") {
      countRequest = countRequest.input("recordDateStringGTE", parameters.recordDateStringGTE);
      resultsRequest = resultsRequest.input("recordDateStringGTE", parameters.recordDateStringGTE);
      whereSQL += " and recordDate >= @recordDateStringGTE";
    }

    if (parameters.recordDateStringLTE && parameters.recordDateStringLTE !== "") {
      countRequest = countRequest.input("recordDateStringLTE", parameters.recordDateStringLTE);
      resultsRequest = resultsRequest.input("recordDateStringLTE", parameters.recordDateStringLTE);
      whereSQL += " and recordDate <= @recordDateStringLTE";
    }

    if (parameters.searchString !== "") {

      const searchStringSplit = parameters.searchString.trim().split(" ");

      for (const [index, element] of searchStringSplit.entries()) {

        const inputKey = "searchString" + index.toString();

        countRequest = countRequest.input(inputKey, element);
        resultsRequest = resultsRequest.input(inputKey, element);

        whereSQL += " and (" +
          "recordNumber like '%' + @" + inputKey + " + '%'" +
          " or recordTitle like '%' + @" + inputKey + " + '%'" +
          " or recordDescription like '%' + @" + inputKey + " + '%'" +
          " or party like '%' + @" + inputKey + " + '%'" +
          " or location like '%' + @" + inputKey + " + '%'" +
          ")";
      }
    }

    const countResult = await countRequest.query("select count(*) as cnt from CR.Records" +
      whereSQL);

    returnObject.count = countResult.recordset[0].cnt;

    if (returnObject.count === 0) {
      return returnObject;
    }

    const sql = "select top " + (options.limit + options.offset).toString() +
      " recordID, recordTypeKey, recordNumber," +
      " recordTitle, recordDescription, party, location, recordDate," +
      " recordCreate_userName, recordCreate_datetime," +
      " recordUpdate_userName, recordUpdate_datetime," +
      " statusTypeKey, statusType, statusTime" +
      " from CR.Records r" +
      " outer apply (" +
      "select top 1 s.statusTime, s.statusTypeKey, t.statusType" +
      " from CR.RecordStatusLog s" +
      " left join CR.StatusTypes t on s.statusTypeKey = t.statusTypeKey" +
      " where r.recordID = s.recordID" +
      " and recordDelete_datetime is null" +
      " order by statusTime desc, statusLogID desc) s" +
      whereSQL +
      " order by recordDate desc, recordCreate_datetime desc, recordNumber desc";

    const result = await resultsRequest.query(sql);

    returnObject.records = result.recordset.slice(options.offset);

    return returnObject;

  } catch (error) {
    debugSQL(error);
  }
};


export default getRecords;
