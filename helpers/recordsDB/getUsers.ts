import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type { User } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getUsers");


export const getUsers = async (): Promise<User[]> => {

  let users: User[] = [];

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    const result = await pool.request()
      .query("select userName, canUpdate, isAdmin, isActive" +
        " from CR.Users" +
        " order by userName");

    users = result.recordset;

  } catch (error) {
    debugSQL(error);
  }

  return users;
};


export default getUsers;
