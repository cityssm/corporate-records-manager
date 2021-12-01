import type { RequestHandler } from "express";

import { getRecordUserTypes } from "../../helpers/recordsDB/getRecordUserTypes.js";


export const handler: RequestHandler = async (_request, response) => {

  const recordUserTypes = await getRecordUserTypes(true);

  return response.json({
    success: true,
    recordUserTypes
  });

};


export default handler;
