import type * as recordTypes from "../../types/recordTypes";

import db_getRecordTypes from "./getRecordTypes.js";

import NodeCache from "node-cache";

import debug from "debug";

const debugCache = debug("corporate-records-manager:recordsDB:configCache");


const cache = new NodeCache({ stdTTL: 600 });


const getCachedDataOrDoQuery = async (cacheKey: string, dbFunction: () => Promise<any[]>) => {

  let result: any[] = cache.get(cacheKey);

  if (result) {
    debugCache("Cache hit: " + cacheKey);
    return result;
  }

  result = await dbFunction();

  cache.set(cacheKey, result);

  return result;
};


export const getRecordTypes = async () => {
  const recordTypes: recordTypes.RecordType[] =
    await getCachedDataOrDoQuery("recordTypes", db_getRecordTypes);
  return recordTypes;
};


export const getRecordType = async (recordTypeKey: string) => {

  const recordTypes = await getRecordTypes();

  const recordType = recordTypes.find((possibleValue) => {
    return possibleValue.recordTypeKey === recordTypeKey;
  });

  return recordType;
};
