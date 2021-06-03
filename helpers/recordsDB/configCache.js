import db_getRecordTypes from "./getRecordTypes.js";
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 600 });
const getCachedDataOrDoQuery = async (cacheKey, dbFunction) => {
    let result = cache.get(cacheKey);
    if (result) {
        return result;
    }
    result = await dbFunction();
    cache.set(cacheKey, result);
    return result;
};
export const getRecordTypes = async () => {
    const recordTypes = await getCachedDataOrDoQuery("recordTypes", db_getRecordTypes);
    return recordTypes;
};
export const getRecordType = async (recordTypeKey) => {
    const recordTypes = await getRecordTypes();
    const recordType = recordTypes.find((possibleValue) => {
        return possibleValue.recordTypeKey === recordTypeKey;
    });
    return recordType;
};
