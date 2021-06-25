import type { RequestHandler } from "express";

import * as cache from "../../helpers/recordsDB/configCache.js";

import getAllStatusTypes from "../../helpers/recordsDB/getAllStatusTypes.js";
import updateStatusType from "../../helpers/recordsDB/updateStatusType.js";

import type * as recordTypes from "../../types/recordTypes";


export const handler: RequestHandler = async (req, res) => {

  const statusType: recordTypes.StatusType = {
    statusTypeKey: req.body.statusTypeKey,
    statusType: req.body.statusType
  };

  const success = await updateStatusType(statusType);

  if (success) {

    cache.clearCache();

    const statusTypesReturn = await getAllStatusTypes();

    return res.json({
      success: true,
      statusTypes: statusTypesReturn
    });

  } else {
    return res.json({
      success: false,
      message: "An unknown error occurred."
    });
  }
};


export default handler;
