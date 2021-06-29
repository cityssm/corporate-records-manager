import type { RequestHandler } from "express";

import { removeURL } from "../../helpers/recordsDB/removeURL.js";


export const handler: RequestHandler = async (request, response) => {

  const success = await removeURL(request.body.urlID, request.session);

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
