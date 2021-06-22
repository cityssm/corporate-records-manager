import type { RequestHandler } from "express";

import updateStatus from "../../helpers/recordsDB/updateStatus.js";


export const handler: RequestHandler = async (req, res) => {

  const success = await updateStatus(req.body, req.session);

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
