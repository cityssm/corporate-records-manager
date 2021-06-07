import type { RequestHandler } from "express";

import getRecords from "../helpers/recordsDB/getRecords.js";


export const handler: RequestHandler = async (req, res) => {

  const records = await getRecords({
    recordTypeKey: req.body.recordTypeKey,
    searchString: req.body.searchString
  });

  if (records) {
    return res.json({
      success: true,
      records
    });
  } else {
    return res.json({
      success: false,
      message: "An unknown error occurred.  Please try again."
    });
  }
};


export default handler;
