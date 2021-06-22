import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type { User } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:addUser");


export const addUser = async (userName: string): Promise<User> => {

  const user: User = {
    userName: userName,
    isActive: true,
    canUpdate: false,
    isAdmin: false
  };


  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    await pool.request()
      .input("userName", user.userName)
      .input("isActive", user.isActive)
      .input("canUpdate", user.canUpdate)
      .input("isAdmin", user.isAdmin)
      .query("insert into CR.Users" +
        " (userName, isActive, canUpdate, isAdmin)" +
        " values (@userName, @isActive, @canUpdate, @isAdmin)");

    return user;

  } catch (e) {
    debugSQL(e);
  }

  return null;
};


export default addUser;
