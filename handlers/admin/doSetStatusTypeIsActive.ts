import type { RequestHandler } from "express";

import updateStatusTypeIsActive from "../../helpers/recordsDB/updateStatusTypeIsActive.js";

import { clearCache } from "../../helpers/recordsDB/configCache.js";


export const handler: RequestHandler = async (req, res) => {

  const statusTypeKey: string = req.body.statusTypeKey;
  const isActive: boolean = req.body.isActive;

  await updateStatusTypeIsActive(statusTypeKey, isActive);

  clearCache();

  return res.json({
    success: true
  });

};


export default handler;
