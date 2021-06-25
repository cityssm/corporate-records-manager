import type { RequestHandler } from "express";

import * as cache from "../../helpers/recordsDB/configCache.js";

import removeStatusType from "../../helpers/recordsDB/removeStatusType.js";
import getAllStatusTypes from "../../helpers/recordsDB/getAllStatusTypes.js";


export const handler: RequestHandler = async (req, res) => {

  const success = await removeStatusType(req.body.statusTypeKey);

  if (success) {
    cache.clearCache();

    const statusTypes = await getAllStatusTypes();

    return res.json({
      success: true,
      statusTypes
    });

  } else {
    return res.json({
      success: false,
      message: "An unknown error occurred."
    });
  }
};


export default handler;
