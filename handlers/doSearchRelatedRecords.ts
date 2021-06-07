import type { RequestHandler } from "express";

import searchRelatedRecords from "../helpers/recordsDB/searchRelatedRecords.js";


export const handler: RequestHandler = async (req, res) => {

  const records = await searchRelatedRecords(req.body.recordID, req.body.recordTypeKey, req.body.searchString);

  if (records) {
    return res.json({
      success: true,
      records: records
    });
  } else {
    return res.json({
      success: false,
      message: "An unknown error occurred.  Please try again."
    });
  }
};


export default handler;
