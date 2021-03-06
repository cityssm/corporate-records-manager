import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";

import type * as sqlTypes from "mssql";
import type * as expressSession from "express-session";
import type { RecordComment } from "../../types/recordTypes";

import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:updateComment");


export const updateComment = async (commentForm: RecordComment, requestSession: expressSession.Session): Promise<boolean> => {

  try {
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    const commentTime = new Date(commentForm.commentDateString + " " + commentForm.commentTimeString);

    await pool.request()
      .input("commentTime", commentTime)
      .input("comment", commentForm.comment)
      .input("recordUpdate_userName", requestSession.user.userName)
      .input("recordUpdate_datetime", new Date())
      .input("commentLogID", commentForm.commentLogID)
      .query("update CR.RecordCommentLog" +
        " set commentTime = @commentTime," +
        " comment = @comment," +
        " recordUpdate_userName = @recordUpdate_userName," +
        " recordUpdate_datetime = @recordUpdate_datetime" +
        " where commentLogID = @commentLogID" +
        " and recordDelete_datetime is null");

    return true;

  } catch (error) {
    debugSQL(error);
  }

  return false;
};


export default updateComment;
