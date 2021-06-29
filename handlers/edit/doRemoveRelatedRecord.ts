import type { RequestHandler } from "express";

import { removeRelatedRecord } from "../../helpers/recordsDB/removeRelatedRecord.js";


export const handler: RequestHandler = async (request, response) => {

  const recordID = request.body.recordID;
  const relatedRecordID = request.body.relatedRecordID;

  await removeRelatedRecord(recordID, relatedRecordID);

  return response.json({
    success: true
  });
};


export default handler;
