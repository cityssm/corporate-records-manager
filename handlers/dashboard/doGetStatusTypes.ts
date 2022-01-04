import type { RequestHandler } from "express";

import { getStatusTypes } from "../../helpers/recordsDB/getStatusTypes.js";


export const handler: RequestHandler = async (request, response) => {

  const statusTypes = await getStatusTypes(request.body.recordTypeKey);

  return response.json({
    statusTypes
  });
};


export default handler;
