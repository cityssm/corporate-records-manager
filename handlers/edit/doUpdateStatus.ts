import type { RequestHandler } from "express";

import { updateStatus } from "../../helpers/recordsDB/updateStatus.js";


export const handler: RequestHandler = async (request, response) => {

  const success = await updateStatus(request.body, request.session);

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
