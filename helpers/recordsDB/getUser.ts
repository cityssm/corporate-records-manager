import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type { User } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getUser");


export const getUser = async (userName: string, filterByIsActive = true): Promise<User> => {

  let user: User;

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    const result = await pool.request()
      .input("userName", userName)
      .query("select userName, fullName, canUpdate, isAdmin" +
        " from CR.Users" +
        " where userName = @userName" +
        (filterByIsActive ? " and isActive = 1" : ""));

    if (result.recordset && result.recordset.length > 0) {
      user = result.recordset[0];
    }

  } catch (error) {
    debugSQL(error);
  }

  return user;
};


export default getUser;
