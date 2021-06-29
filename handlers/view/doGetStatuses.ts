import type { RequestHandler } from "express";

import { getRecordStatuses } from "../../helpers/recordsDB/getRecordStatuses.js";


export const handler: RequestHandler = async (request, response) => {

  const recordID = request.body.recordID;

  const statuses = await getRecordStatuses(recordID);

  return statuses
    ? response.json({
      success: true,
      statuses
    })
    : response.json({
      success: false,
      message: "An unknown error occurred.  Please try again."
    });
};


export default handler;
