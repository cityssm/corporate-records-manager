import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getUsers");
export const getUsers = async () => {
    let users = [];
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const result = await pool.request()
            .query("select userName, canUpdate, isAdmin, isActive" +
            " from CR.Users" +
            " order by userName");
        users = result.recordset;
    }
    catch (e) {
        debugSQL(e);
    }
    return users;
};
export default getUsers;
