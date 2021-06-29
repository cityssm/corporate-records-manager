import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:updateUserSetting");
export const updateUserSetting = async (userName, fieldName, fieldValue) => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        await pool.request()
            .input("fieldValue", fieldValue)
            .input("userName", userName)
            .query("update CR.Users" +
            " set " + fieldName + " = @fieldValue" +
            " where userName = @userName");
        return true;
    }
    catch (error) {
        debugSQL(error);
        return false;
    }
};
export default updateUserSetting;
