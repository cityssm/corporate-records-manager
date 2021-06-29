import type { RequestHandler } from "express";

import { addURL } from "../../helpers/recordsDB/addURL.js";


export const handler: RequestHandler = async (request, response) => {

  const success = await addURL(request.body, request.session);

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
