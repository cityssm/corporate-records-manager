import type { RequestHandler } from "express";

import * as cache from "../../helpers/recordsDB/configCache.js";

import updateRecordType from "../../helpers/recordsDB/updateRecordType.js";

import type * as recordTypes from "../../types/recordTypes";


export const handler: RequestHandler = async (req, res) => {

  const recordType: recordTypes.RecordType = {
    recordTypeKey: req.body.recordTypeKey,
    recordType: req.body.recordType,
    minlength: parseInt(req.body.minlength),
    maxlength: parseInt(req.body.maxlength),
    pattern: req.body.pattern,
    patternHelp: req.body.patternHelp
  };

  const success = await updateRecordType(recordType);

  if (success) {

    cache.clearCache();

    return res.json({
      success: true,
      recordType
    });

  } else {
    return res.json({
      success: false,
      message: "An unknown error occurred."
    });
  }
};


export default handler;
