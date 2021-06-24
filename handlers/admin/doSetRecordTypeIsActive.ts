import type { RequestHandler } from "express";

import { updateRecordTypeIsActive } from "../../helpers/recordsDB/updateRecordTypeIsActive.js";

import { clearCache } from "../../helpers/recordsDB/configCache.js";


export const handler: RequestHandler = async (req, res) => {

  const recordTypeKey: string = req.body.recordTypeKey;
  const isActive: boolean = req.body.isActive;

  await updateRecordTypeIsActive(recordTypeKey, isActive);

  clearCache();

  return res.json({
    success: true
  });

};


export default handler;
