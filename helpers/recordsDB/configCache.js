import database_getRecordTypes from "./getRecordTypes.js";
import database_getStatusTypes from "./getStatusTypes.js";
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 600 });
const getCachedDataOrDoQuery = async (cacheKey, databaseFunction) => {
    let result = cache.get(cacheKey);
    if (result) {
        return result;
    }
    result = await databaseFunction();
    cache.set(cacheKey, result);
    return result;
};
export const getRecordTypes = async () => {
    const recordTypes = await getCachedDataOrDoQuery("recordTypes", database_getRecordTypes);
    return recordTypes;
};
export const getRecordType = async (recordTypeKey) => {
    const recordTypesList = await getRecordTypes();
    const recordType = recordTypesList.find((possibleValue) => {
        return possibleValue.recordTypeKey === recordTypeKey;
    });
    return recordType;
};
export const clearCache = () => {
    cache.flushAll();
};
export const getStatusTypes = async (recordTypeKey) => {
    const statusTypes = await getCachedDataOrDoQuery("statusTypes:" + recordTypeKey, async () => {
        return await database_getStatusTypes(recordTypeKey);
    });
    return statusTypes;
};
