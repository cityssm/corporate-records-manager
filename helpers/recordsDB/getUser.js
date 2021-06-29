import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getUser");
export const getUser = async (userName, filterByIsActive = true) => {
    let user;
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const result = await pool.request()
            .input("userName", userName)
            .query("select userName, canUpdate, isAdmin" +
            " from CR.Users" +
            " where userName = @userName" +
            (filterByIsActive ? " and isActive = 1" : ""));
        if (result.recordset && result.recordset.length > 0) {
            user = result.recordset[0];
        }
    }
    catch (error) {
        debugSQL(error);
    }
    return user;
};
export default getUser;
