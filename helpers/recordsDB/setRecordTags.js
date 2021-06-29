import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:setRecordTags");
export const setRecordTags = async (recordID, recordTags) => {
    const tags = (typeof recordTags === "string" ? [recordTags] : recordTags);
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        for (const tag of tags) {
            await pool.request()
                .input("recordID", recordID)
                .input("tag", tag)
                .query("insert into CR.RecordTags" +
                " (recordID, tag)" +
                " values (@recordID, @tag)");
        }
    }
    catch (error) {
        debugSQL(error);
        return false;
    }
    return true;
};
export default setRecordTags;
