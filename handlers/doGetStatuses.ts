import type { RequestHandler } from "express";

import getRecordStatuses from "../helpers/recordsDB/getRecordStatuses.js";


export const handler: RequestHandler = async (req, res) => {

  const recordID = req.body.recordID;

  const statuses = await getRecordStatuses(recordID);

  if (statuses) {
    return res.json({
      success: true,
      statuses
    });
  } else {
    return res.json({
      success: false,
      message: "An unknown error occurred.  Please try again."
    });
  }
};


export default handler;
