import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type { User } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getUser");


export const getUser = async (userName: string): Promise<User> => {

  let user: User = null;

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    const userPermissionsResult = await pool.request()
      .input("userName", userName)
      .query("select userName, canUpdate, isAdmin" +
        " from CR.Users" +
        " where isActive = 1" +
        " and userName = @userName");

    if (userPermissionsResult.recordset && userPermissionsResult.recordset.length > 0) {
      user = userPermissionsResult.recordset[0];
    }

  } catch (e) {
    debugSQL(e);
  }

  return user;
};


export default getUser;
