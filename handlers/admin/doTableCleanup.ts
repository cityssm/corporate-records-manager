import type { RequestHandler } from "express";

import { cleanupRecordsTable } from "../../helpers/recordsDB/cleanupRecordsTable.js";
import { cleanupRecordTagsTable } from "../../helpers/recordsDB/cleanupRecordTagsTable.js";
import { cleanupRelatedRecordsTable } from "../../helpers/recordsDB/cleanupRelatedRecordsTable.js";
import { cleanupRecordStatusLogTable, cleanupRecordURLsTable, cleanupRecordCommentLogTable } from "../../helpers/recordsDB/cleanupTable.js";


export const handler: RequestHandler = async (request, response) => {

  const tableName = request.body.tableName as string;
  let recordCount = 0;

  switch (tableName) {

    case "Records":
      recordCount = await cleanupRecordsTable();
      break;

    case "RecordTags":
      recordCount = await cleanupRecordTagsTable();
      break;

    case "RecordStatusLog":
      recordCount = await cleanupRecordStatusLogTable();
      break;

    case "RecordURLs":
      recordCount = await cleanupRecordURLsTable();
      break;

    case "RelatedRecords":
      recordCount = await cleanupRelatedRecordsTable();
      break;

    case "RecordCommentLog":
      recordCount = await cleanupRecordCommentLogTable();
      break;

    default:
      return response.json({
        success: false,
        message: "Invalid tableName = " + tableName
      });
  }

  return response.json({
    success: true,
    recordCount
  });
};


export default handler;
