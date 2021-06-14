import type { RequestHandler } from "express";

import removeRelatedRecord from "../helpers/recordsDB/removeRelatedRecord.js";


export const handler: RequestHandler = async (req, res) => {

  const recordID = req.body.recordID;
  const relatedRecordID = req.body.relatedRecordID;

  await removeRelatedRecord(recordID, relatedRecordID);

  return res.json({
    success: true
  });
};


export default handler;
