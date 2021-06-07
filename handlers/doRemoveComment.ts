import type { RequestHandler } from "express";

import removeComment from "../helpers/recordsDB/removeComment.js";


export const handler: RequestHandler = async (req, res) => {

  const success = await removeComment(req.body.commentLogID, req.session);

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
