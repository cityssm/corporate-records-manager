import type { RequestHandler } from "express";

import * as cache from "../../helpers/recordsDB/configCache.js";

import { removeRecordUserType } from "../../helpers/recordsDB/removeRecordUserType.js";


export const handler: RequestHandler = async (request, response) => {

  const success = await removeRecordUserType(request.body.recordUserTypeKey);

  cache.clearCache();

  return success
    ? response.json({
      success: true
    })
    : response.json({
      success: false,
      message: "An unknown error occurred."
    });
};


export default handler;
