import type { RequestHandler } from "express";

import { addStatus } from "../../helpers/recordsDB/addStatus.js";


export const handler: RequestHandler = async (request, response) => {

  const statusLogID = await addStatus(request.body, request.session);

  return statusLogID
    ? response.json({
      success: true,
      statusLogID
    })
    : response.json({
      success: false,
      message: "An unknown error occurred.  Please try again."
    });
};


export default handler;
