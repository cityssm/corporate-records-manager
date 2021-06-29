import type { RequestHandler } from "express";

import { getRelatedRecords } from "../../helpers/recordsDB/getRelatedRecords.js";


export const handler: RequestHandler = async (request, response) => {

  const recordID = request.body.recordID;

  const relatedRecords = await getRelatedRecords(recordID);

  return relatedRecords
    ? response.json({
      success: true,
      relatedRecords
    })
    : response.json({
      success: false,
      message: "An unknown error occurred.  Please try again."
    });
};


export default handler;
