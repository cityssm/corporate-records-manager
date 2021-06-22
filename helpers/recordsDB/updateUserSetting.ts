import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:updateUserSetting");


export type FieldName = "isActive" | "canUpdate" | "isAdmin";


export const updateUserSetting = async (userName: string, fieldName: FieldName, fieldValue: boolean): Promise<boolean> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    await pool.request()
      .input("fieldValue", fieldValue)
      .input("userName", userName)
      .query("update CR.Users" +
        " set " + fieldName + " = @fieldValue" +
        " where userName = @userName");

    return true;

  } catch (e) {
    debugSQL(e);
    return false;
  }
};


export default updateUserSetting;
