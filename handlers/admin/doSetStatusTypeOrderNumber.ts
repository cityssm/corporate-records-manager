import type { RequestHandler } from "express";

import setStatusTypeOrderNumber from "../../helpers/recordsDB/setStatusTypeOrderNumber.js";
import getAllStatusTypes from "../../helpers/recordsDB/getAllStatusTypes.js";

import { clearCache } from "../../helpers/recordsDB/configCache.js";


export const handler: RequestHandler = async (req, res) => {

  const statusTypeKey: string = req.body.statusTypeKey;
  const orderNumber: number = req.body.orderNumber;

  await setStatusTypeOrderNumber(statusTypeKey, orderNumber, true);

  clearCache();

  const statusTypes = await getAllStatusTypes();

  return res.json({
    success: true,
    statusTypes
  });

};


export default handler;
