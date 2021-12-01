import type { RequestHandler } from "express";

import { updateRecordUserTypeIsActive } from "../../helpers/recordsDB/updateRecordUserTypeIsActive.js";

import { clearCache } from "../../helpers/recordsDB/configCache.js";


export const handler: RequestHandler = async (request, response) => {

  const recordUserTypeKey: string = request.body.recordUserTypeKey;
  const isActive: boolean = request.body.isActive;

  await updateRecordUserTypeIsActive(recordUserTypeKey, isActive);

  clearCache();

  return response.json({
    success: true
  });
};


export default handler;
