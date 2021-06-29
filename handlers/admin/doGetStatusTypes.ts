import type { RequestHandler } from "express";

import { getAllStatusTypes } from "../../helpers/recordsDB/getAllStatusTypes.js";


export const handler: RequestHandler = async (_request, response) => {

  const statusTypes = await getAllStatusTypes();

  return response.json({
    success: true,
    statusTypes
  });

};


export default handler;
