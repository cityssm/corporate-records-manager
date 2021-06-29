import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getSuggestedRecordTags");
export const getSuggestedRecordTags = async (recordID, searchString = "") => {
    const tags = [];
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        let request = pool.request();
        let sql = "select top 20 tag" +
            " from CR.RecordTags" +
            " where 1 = 1";
        if (recordID !== "") {
            request = request.input("recordID", recordID);
            sql += " and tag not in (select tag from CR.RecordTags where recordID = @recordID)" +
                " and recordID in (" +
                "select recordID from CR.Records where recordDelete_datetime is null" +
                " and recordTypeKey in (select recordTypeKey from CR.Records where recordID = @recordID)" +
                ")";
        }
        if (searchString !== "") {
            const searchStringSplit = searchString.trim().split(" ");
            for (const [index, element] of searchStringSplit.entries()) {
                const inputKey = "searchString" + index.toString();
                request = request.input(inputKey, element);
                sql += " and tag like '%' + @" + inputKey + " + '%'";
            }
        }
        sql += " group by tag" +
            " having count(recordID) > 1" +
            " order by count(recordID) desc";
        const result = await request
            .query(sql);
        if (result.recordset && result.recordset.length > 0) {
            for (const row of result.recordset) {
                tags.push(row.tag);
            }
        }
    }
    catch (error) {
        debugSQL(error);
    }
    return tags;
};
export default getSuggestedRecordTags;
