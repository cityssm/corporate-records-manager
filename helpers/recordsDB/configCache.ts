import type * as recordTypes from "../../types/recordTypes";

import database_getRecordTypes from "./getRecordTypes.js";
import database_getRecordUserTypes from "./getRecordUserTypes.js";
import database_getStatusTypes from "./getStatusTypes.js";

import NodeCache from "node-cache";


const cache = new NodeCache({ stdTTL: 600 });


const getCachedDataOrDoQuery = async (cacheKey: string, databaseFunction: () => Promise<unknown[]>) => {

  let result: unknown[] = cache.get(cacheKey);

  if (result) {
    return result;
  }

  result = await databaseFunction();

  cache.set(cacheKey, result);

  return result;
};


export const getRecordTypes = async (): Promise<recordTypes.RecordType[]> => {
  const recordTypes =
    await getCachedDataOrDoQuery("recordTypes", database_getRecordTypes) as recordTypes.RecordType[];
  return recordTypes;
};


export const getRecordType = async (recordTypeKey: string): Promise<recordTypes.RecordType> => {

  const recordTypesList = await getRecordTypes();

  const recordType = recordTypesList.find((possibleValue) => {
    return possibleValue.recordTypeKey === recordTypeKey;
  });

  return recordType;
};


export const clearCache = (): void => {
  cache.flushAll();
};


export const getStatusTypes = async (recordTypeKey: string): Promise<recordTypes.StatusType[]> => {
  const statusTypes =
    await getCachedDataOrDoQuery("statusTypes:" + recordTypeKey, async () => {
      return await database_getStatusTypes(recordTypeKey);
    }) as recordTypes.StatusType[];
  return statusTypes;
};


export const getRecordUserTypes = async (): Promise<recordTypes.RecordUserType[]> => {
  const recordUserTypes =
    await getCachedDataOrDoQuery("recordUserTypes", database_getRecordUserTypes) as recordTypes.RecordUserType[];
  return recordUserTypes;
};
