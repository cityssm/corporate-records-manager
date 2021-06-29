import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:removeUser");
export const removeUser = async (userName) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        await pool.request()
            .input("userName", userName)
            .query("delete from CR.Users" +
            " where userName = @userName");
        return true;
    }
    catch (error) {
        debugSQL(error);
    }
    return false;
};
export default removeUser;
