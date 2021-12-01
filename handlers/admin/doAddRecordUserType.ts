import type { RequestHandler } from "express";

import * as cache from "../../helpers/recordsDB/configCache.js";

import { addRecordUserType } from "../../helpers/recordsDB/addRecordUserType.js";

import type * as recordTypes from "../../types/recordTypes";


const isRecordUserTypeKeyAvailable = async (recordUserTypeKey: string) => {

  const recordUserTypes = await cache.getRecordUserTypes();

  const recordUserType = recordUserTypes.find((possibleRecordUserType) => {
    return possibleRecordUserType.recordUserTypeKey === recordUserTypeKey;
  });

  if (recordUserType) {
    return false;
  }

  return true;
};


const generateRecordUserTypeKey = async (recordUserTypeKey: string, recordUserType: string) => {

  cache.clearCache();

  let recordUserTypeKeyIsAvailable = false;

  // check if provided recordTypeKey is available
  if (recordUserTypeKey !== "") {
    recordUserTypeKeyIsAvailable = await isRecordUserTypeKeyAvailable(recordUserTypeKey);

    if (recordUserTypeKeyIsAvailable) {
      return recordUserTypeKey;
    }
  }

  // build a recordUserTypeKeyRoot
  const recordUserTypeKeyRoot =
    (recordUserTypeKey === ""
      ? (recordUserType
        .toLowerCase()
        .trim()
        .replace(/[^_a-z-]/g, "-"))
      : recordUserTypeKey)
      .slice(0, 14);

  recordUserTypeKeyIsAvailable = await isRecordUserTypeKeyAvailable(recordUserTypeKeyRoot);

  if (recordUserTypeKeyIsAvailable) {
    return recordUserTypeKeyRoot;
  }

  // loop through a counter, searching for a unique recordTypeKey
  for (let counter = 0; counter <= 99_999; counter += 1) {

    const recordUserTypeKey = recordUserTypeKeyRoot + "-" + ("0000" + counter.toString()).slice(-5);
    recordUserTypeKeyIsAvailable = await isRecordUserTypeKeyAvailable(recordUserTypeKey);

    if (recordUserTypeKeyIsAvailable) {
      return recordUserTypeKey;
    }
  }

  // give up
  return;
};


export const handler: RequestHandler = async (request, response) => {

  const recordUserTypeKey = await generateRecordUserTypeKey(request.body.recordUserTypeKey, request.body.recordUserType);

  if (!recordUserTypeKey) {

    return response.json({
      success: false,
      message: "Unable to generate a unique record user type key."
    });
  }

  const recordUserType: recordTypes.RecordUserType = {
    recordUserTypeKey,
    recordUserType: request.body.recordUserType,
    isActive: true,
    recordCount: 0
  };

  const success = await addRecordUserType(recordUserType);

  if (success) {

    cache.clearCache();

    return response.json({
      success: true,
      recordUserType
    });

  } else {
    return response.json({
      success: false,
      message: "An unknown error occurred."
    });
  }
};


export default handler;
