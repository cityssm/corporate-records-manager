import type { RequestHandler } from "express";

import * as cache from "../../helpers/recordsDB/configCache.js";

import { addRecordType } from "../../helpers/recordsDB/addRecordType.js";

import type * as recordTypes from "../../types/recordTypes";


const isRecordTypeKeyAvailable = async (recordTypeKey: string) => {
  const recordType = await cache.getRecordType(recordTypeKey);

  if (recordType) {
    return false;
  }

  return true;
};


const generateRecordTypeKey = async (recordTypeKey: string, recordType: string) => {

  cache.clearCache();

  let recordTypeKeyIsAvailable = false;

  // check if provided recordTypeKey is available
  if (recordTypeKey !== "") {
    recordTypeKeyIsAvailable = await isRecordTypeKeyAvailable(recordTypeKey);

    if (recordTypeKeyIsAvailable) {
      return recordTypeKey;
    }
  }

  // build a recordTypeKeyRoot
  const recordTypeKeyRoot =
    (recordTypeKey === ""
      ? (recordType
        .toLowerCase()
        .trim()
        .replace(/[^_a-z-]/g, "-"))
      : recordTypeKey)
      .slice(0, 14);

  recordTypeKeyIsAvailable = await isRecordTypeKeyAvailable(recordTypeKeyRoot);

  if (recordTypeKeyIsAvailable) {
    return recordTypeKeyRoot;
  }

  // loop through a counter, searching for a unique recordTypeKey
  for (let counter = 0; counter <= 99_999; counter += 1) {

    const recordTypeKey = recordTypeKeyRoot + "-" + ("0000" + counter.toString()).slice(-5);
    recordTypeKeyIsAvailable = await isRecordTypeKeyAvailable(recordTypeKey);

    if (recordTypeKeyIsAvailable) {
      return recordTypeKey;
    }
  }

  // give up
  return;
};


export const handler: RequestHandler = async (request, response) => {

  const recordTypeKey = await generateRecordTypeKey(request.body.recordTypeKey, request.body.recordType);

  if (!recordTypeKey) {

    return response.json({
      success: false,
      message: "Unable to generate a unique record type key."
    });
  }

  const recordType: recordTypes.RecordType = {
    recordTypeKey,
    recordType: request.body.recordType,
    minlength: Number.parseInt(request.body.minlength),
    maxlength: Number.parseInt(request.body.maxlength),
    pattern: request.body.pattern,
    patternHelp: request.body.patternHelp,
    isActive: true,
    recordCount: 0
  };

  const success = await addRecordType(recordType);

  if (success) {

    cache.clearCache();

    return response.json({
      success: true,
      recordType
    });

  } else {
    return response.json({
      success: false,
      message: "An unknown error occurred."
    });
  }
};


export default handler;
