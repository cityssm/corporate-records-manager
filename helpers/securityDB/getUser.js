import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:securityDB:getUser");
;
export const getUser = async (userName) => {
    const user = {
        userName,
        canUpdate: false,
        isAdmin: false
    };
    try {
        const pool = await sqlPool.connect(configFns.getProperty("securityMssqlConfig"));
        const userPermissionsResult = await pool.request()
            .input("userName", userName)
            .query("select sus_setting as settingKey" +
            " from security_user_settings" +
            " where sus_username in (select su_username from security_users where su_appkey = 'bps' and su_isactive > 0)" +
            " and sus_username in (select sul_username from security_userlist where sul_isallowed > 0)" +
            " and sus_setting in (select ss_setting from security_settings where ss_appkey = 'corpRec')" +
            " and sus_username = @userName" +
            " and sus_value = 'true'");
        if (userPermissionsResult.recordset && userPermissionsResult.recordset.length > 0) {
            const userPermissions = userPermissionsResult.recordset;
            for (const permission of userPermissions) {
                if (permission.settingKey.endsWith("_canUpdate")) {
                    user.canUpdate = true;
                    break;
                }
            }
        }
        else {
            return null;
        }
    }
    catch (e) {
        debugSQL(e);
        return null;
    }
    return user;
};
export default getUser;
