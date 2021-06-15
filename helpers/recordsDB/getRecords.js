import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getRecords");
;
export const getRecords = async (params, options) => {
    const returnObj = {
        count: 0,
        records: []
    };
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        let countRequest = pool.request();
        let resultsRequest = pool.request();
        let whereSQL = " where recordDelete_datetime is null";
        if (params.recordTypeKey !== "") {
            countRequest = countRequest.input("recordTypeKey", params.recordTypeKey);
            resultsRequest = resultsRequest.input("recordTypeKey", params.recordTypeKey);
            whereSQL += " and recordTypeKey = @recordTypeKey";
        }
        if (params.recordDateStringGTE && params.recordDateStringGTE !== "") {
            countRequest = countRequest.input("recordDateStringGTE", params.recordDateStringGTE);
            resultsRequest = resultsRequest.input("recordDateStringGTE", params.recordDateStringGTE);
            whereSQL += " and recordDate >= @recordDateStringGTE";
        }
        if (params.recordDateStringLTE && params.recordDateStringLTE !== "") {
            countRequest = countRequest.input("recordDateStringLTE", params.recordDateStringLTE);
            resultsRequest = resultsRequest.input("recordDateStringLTE", params.recordDateStringLTE);
            whereSQL += " and recordDate <= @recordDateStringLTE";
        }
        if (params.searchString !== "") {
            const searchStringSplit = params.searchString.trim().split(" ");
            for (let index = 0; index < searchStringSplit.length; index += 1) {
                const inputKey = "searchString" + index.toString();
                countRequest = countRequest.input(inputKey, searchStringSplit[index]);
                resultsRequest = resultsRequest.input(inputKey, searchStringSplit[index]);
                whereSQL += " and (" +
                    "recordNumber like '%' + @" + inputKey + " + '%'" +
                    " or recordTitle like '%' + @" + inputKey + " + '%'" +
                    " or recordDescription like '%' + @" + inputKey + " + '%'" +
                    " or party like '%' + @" + inputKey + " + '%'" +
                    " or location like '%' + @" + inputKey + " + '%'" +
                    ")";
            }
        }
        const countResult = await countRequest.query("select count(*) as cnt from CR.Records" + whereSQL);
        returnObj.count = countResult.recordset[0].cnt;
        if (returnObj.count === 0) {
            return returnObj;
        }
        const result = await resultsRequest.query("select top " + (options.limit + options.offset).toString() +
            " recordID, recordTypeKey, recordNumber," +
            " recordTitle, recordDescription, party, location, recordDate," +
            " recordCreate_userName, recordCreate_datetime," +
            " recordUpdate_userName, recordUpdate_datetime" +
            " from CR.Records" +
            whereSQL +
            " order by recordDate desc, recordCreate_datetime desc");
        returnObj.records = result.recordset.slice(options.offset);
        return returnObj;
    }
    catch (e) {
        debugSQL(e);
    }
};
export default getRecords;
