import type { RequestHandler } from "express";

import { getSuggestedRecordUsers } from "../../helpers/recordsDB/getSuggestedRecordUsers.js";


export const handler: RequestHandler = async (_request, response) => {

  const recordUsers = await getSuggestedRecordUsers();

  return recordUsers
    ? response.json({
      success: true,
      recordUsers
    })
    : response.json({
      success: false,
      message: "An unknown error occurred.  Please try again."
    });
};


export default handler;
