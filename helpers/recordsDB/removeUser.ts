import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:removeUser");


export const removeUser = async (userName: string): Promise<boolean> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    await pool.request()
      .input("userName", userName)
      .query("delete from CR.Users" +
        " where userName = @userName");

    return true;

  } catch (error) {
    debugSQL(error);
  }

  return false;
};


export default removeUser;
