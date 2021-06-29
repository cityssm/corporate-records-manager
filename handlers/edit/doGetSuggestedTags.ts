import type { RequestHandler } from "express";

import { getSuggestedRecordTags } from "../../helpers/recordsDB/getSuggestedRecordTags.js";


export const handler: RequestHandler = async (request, response) => {

  const recordID = request.body.recordID;

  const tags = await getSuggestedRecordTags(recordID, request.body.searchString);

  return tags
    ? response.json({
      success: true,
      tags
    })
    : response.json({
      success: false,
      message: "An unknown error occurred.  Please try again."
    });
};


export default handler;
