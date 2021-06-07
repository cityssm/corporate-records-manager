import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:searchRelatedRecords");
export const searchRelatedRecords = async (recordID, recordTypeKey, searchString) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        let request = pool.request()
            .input("recordID", recordID);
        let sql = "select top 100" +
            " recordID, recordTypeKey, recordNumber," +
            " recordTitle, recordDescription," +
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
        const result = await request.query(sql);
        if (!result.recordset || result.recordset.length === 0) {
            return [];
        }
        const records = result.recordset;
        return records;
    }
    catch (e) {
        debugSQL(e);
    }
};
export default searchRelatedRecords;
