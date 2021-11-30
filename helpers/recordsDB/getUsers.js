import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getUsers");
export const getUsers = async () => {
    let users = [];
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const result = await pool.request()
            .query("select userName, fullName, canUpdate, isAdmin, isActive" +
            " from CR.Users" +
            " order by userName");
        users = result.recordset;
    }
    catch (error) {
        debugSQL(error);
    }
    return users;
};
export default getUsers;
