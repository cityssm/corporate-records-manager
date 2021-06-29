import type { RequestHandler } from "express";

import { addRelatedRecord } from "../../helpers/recordsDB/addRelatedRecord.js";


export const handler: RequestHandler = async (request, response) => {

  const recordID = request.body.recordID;
  const relatedRecordID = request.body.relatedRecordID;

  await addRelatedRecord(recordID, relatedRecordID);

  return response.json({
    success: true
  });
};


export default handler;
