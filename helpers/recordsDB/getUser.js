import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getUser");
export const getUser = async (userName) => {
    let user = null;
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const userPermissionsResult = await pool.request()
            .input("userName", userName)
            .query("select userName, canUpdate, isAdmin" +
            " from CR.Users" +
            " where isActive = 1" +
            " and userName = @userName");
        if (userPermissionsResult.recordset && userPermissionsResult.recordset.length > 0) {
            user = userPermissionsResult.recordset[0];
        }
    }
    catch (e) {
        debugSQL(e);
    }
    return user;
};
export default getUser;
