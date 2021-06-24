import type { RequestHandler } from "express";

import getRecordTypes from "../../helpers/recordsDB/getRecordTypes.js";


export const handler: RequestHandler = async (_req, res) => {

  const recordTypes = await getRecordTypes(true);

  return res.json({
    success: true,
    recordTypes
  });

};


export default handler;
