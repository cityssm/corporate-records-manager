import type { RequestHandler } from "express";

import { updateRecordTypeIsActive } from "../../helpers/recordsDB/updateRecordTypeIsActive.js";

import { clearCache } from "../../helpers/recordsDB/configCache.js";


export const handler: RequestHandler = async (request, response) => {

  const recordTypeKey: string = request.body.recordTypeKey;
  const isActive: boolean = request.body.isActive;

  await updateRecordTypeIsActive(recordTypeKey, isActive);

  clearCache();

  return response.json({
    success: true
  });
};


export default handler;
