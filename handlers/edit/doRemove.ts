import type { RequestHandler } from "express";

import removeRecord from "../../helpers/recordsDB/removeRecord.js";


export const handler: RequestHandler = async (req, res) => {

  const recordID = req.body.recordID;

  const success = await removeRecord(recordID, req.session);

  if (success) {
    return res.json({
      success: true
    });
  } else {
    return res.json({
      success: false,
      message: "An unknown error occurred.  Please try again."
    });
  }
};


export default handler;
