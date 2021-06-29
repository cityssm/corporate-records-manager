import type { RequestHandler } from "express";

import { updateRecord } from "../../helpers/recordsDB/updateRecord.js";


export const handler: RequestHandler = async (request, response) => {

  const success = await updateRecord(request.body, request.session);

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
