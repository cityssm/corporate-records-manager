import type { RequestHandler } from "express";

import { removeComment } from "../../helpers/recordsDB/removeComment.js";


export const handler: RequestHandler = async (request, response) => {

  const success = await removeComment(request.body.commentLogID, request.session);

  return success
    ? response.json({
      success: true
    })
    : response.json({
      success: false,
      message: "An unknown error occurred.  Please try again."
    });
};


export default handler;
