import type { RequestHandler } from "express";

import { updateStatusTypeIsActive } from "../../helpers/recordsDB/updateStatusTypeIsActive.js";

import { clearCache } from "../../helpers/recordsDB/configCache.js";


export const handler: RequestHandler = async (request, response) => {

  const statusTypeKey: string = request.body.statusTypeKey;
  const isActive: boolean = request.body.isActive;

  await updateStatusTypeIsActive(statusTypeKey, isActive);

  clearCache();

  return response.json({
    success: true
  });

};


export default handler;
