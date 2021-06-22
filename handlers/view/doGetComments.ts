import type { RequestHandler } from "express";

import getRecordComments from "../../helpers/recordsDB/getRecordComments.js";


export const handler: RequestHandler = async (req, res) => {

  const recordID = req.body.recordID;

  const comments = await getRecordComments(recordID);

  if (comments) {
    return res.json({
      success: true,
      comments
    });
  } else {
    return res.json({
      success: false,
      message: "An unknown error occurred.  Please try again."
    });
  }
};


export default handler;
