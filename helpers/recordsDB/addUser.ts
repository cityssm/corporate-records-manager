import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type { User } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:addUser");


export const addUser = async (userName: string): Promise<User> => {

  const user: User = {
    userName: userName,
    fullName: userName,
    isActive: true,
    canViewAll: false,
    canUpdate: false,
    isAdmin: false
  };


  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    await pool.request()
      .input("userName", user.userName)
      .input("fullName", user.fullName)
      .input("isActive", user.isActive)
      .input("canViewAll", user.canViewAll)
      .input("canUpdate", user.canUpdate)
      .input("isAdmin", user.isAdmin)
      .query("insert into CR.Users" +
        " (userName, fullName, isActive, canViewAll, canUpdate, isAdmin)" +
        " values (@userName, @fullName, @isActive, @canViewAll, @canUpdate, @isAdmin)");

    return user;

  } catch (error) {
    debugSQL(error);
  }

  return undefined;
};


export default addUser;
