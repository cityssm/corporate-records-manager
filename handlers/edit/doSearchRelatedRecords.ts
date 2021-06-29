import type { RequestHandler } from "express";

import { searchRelatedRecords } from "../../helpers/recordsDB/searchRelatedRecords.js";


export const handler: RequestHandler = async (request, response) => {

  const records = await searchRelatedRecords(request.body.recordID, request.body.recordTypeKey, request.body.searchString);

  return records
    ? response.json({
      success: true,
      records: records
    })
    : response.json({
      success: false,
      message: "An unknown error occurred.  Please try again."
    });
};


export default handler;
