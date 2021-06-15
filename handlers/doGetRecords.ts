import type { RequestHandler } from "express";

import getRecords from "../helpers/recordsDB/getRecords.js";


export const handler: RequestHandler = async (req, res) => {

  const results = await getRecords({
    recordTypeKey: req.body.recordTypeKey,
    searchString: req.body.searchString,
    recordNumber: req.body.recordNumber,
    recordDateStringGTE: req.body["recordDateString-gte"],
    recordDateStringLTE: req.body["recordDateString-lte"]
  }, {
    limit: parseInt(req.body.limit, 10),
    offset: parseInt(req.body.offset, 10)
  });

  if (results) {
    return res.json({
      success: true,
      count: results.count,
      records: results.records
    });
  } else {
    return res.json({
      success: false,
      message: "An unknown error occurred.  Please try again."
    });
  }
};


export default handler;
