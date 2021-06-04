import type { RequestHandler } from "express";

import removeURL from "../helpers/recordsDB/removeURL.js";


export const handler: RequestHandler = async (req, res) => {

  const success = await removeURL(req.body.urlID, req.session);

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
