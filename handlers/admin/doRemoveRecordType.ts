import type { RequestHandler } from "express";

import * as cache from "../../helpers/recordsDB/configCache.js";

import { removeRecordType } from "../../helpers/recordsDB/removeRecordType.js";


export const handler: RequestHandler = async (request, response) => {

  const success = await removeRecordType(request.body.recordTypeKey);

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
