import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getSuggestedRecordUsers");
export const getSuggestedRecordUsers = async () => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const result = await pool.request()
            .query("select" +
            " case" +
            " when u.userName is not null and u.userName != '' then u.userName" +
            " else r.userName" +
            " end as userName," +
            " case" +
            " when u.fullName is not null and u.fullName != '' then u.fullName" +
            " when u.userName is not null and u.userName != '' then u.userName" +
            " else r.userName" +
            " end as fullName," +
            " count(recordUserID) as recordCount" +
            " from CR.Users u" +
            " full join CR.RecordUsers r on u.userName = r.userName and r.recordDelete_datetime is null" +
            " group by u.userName, u.fullName, r.userName" +
            " order by recordCount desc");
        if (result.recordset && result.recordset.length > 0) {
            return result.recordset;
        }
    }
    catch (error) {
        debugSQL(error);
    }
    return [];
};
export default getSuggestedRecordUsers;
