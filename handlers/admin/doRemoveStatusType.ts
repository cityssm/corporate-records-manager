import type { RequestHandler } from "express";

import * as cache from "../../helpers/recordsDB/configCache.js";

import {removeStatusType} from "../../helpers/recordsDB/removeStatusType.js";
import {getAllStatusTypes} from "../../helpers/recordsDB/getAllStatusTypes.js";


export const handler: RequestHandler = async (request, response) => {

  const success = await removeStatusType(request.body.statusTypeKey);

  if (success) {
    cache.clearCache();

    const statusTypes = await getAllStatusTypes();

    return response.json({
      success: true,
      statusTypes
    });

  } else {
    return response.json({
      success: false,
      message: "An unknown error occurred."
    });
  }
};


export default handler;
