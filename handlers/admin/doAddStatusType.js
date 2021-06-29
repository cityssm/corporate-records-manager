import * as cache from "../../helpers/recordsDB/configCache.js";
import { getAllStatusTypes } from "../../helpers/recordsDB/getAllStatusTypes.js";
import { addStatusType } from "../../helpers/recordsDB/addStatusType.js";
let statusTypes;
const isStatusTypeKeyAvailable = (statusTypeKey) => {
    const statusType = statusTypes.find((currentStatusType) => {
        return currentStatusType.statusTypeKey === statusTypeKey;
    });
    if (statusType) {
        return false;
    }
    return true;
};
const generateStatusTypeKey = (recordTypeKey, statusTypeKey, statusType) => {
    cache.clearCache();
    let statusTypeKeyIsAvailable = false;
    if (statusTypeKey !== "") {
        console.log("Check statusTypeKey = " + statusTypeKey);
        statusTypeKeyIsAvailable = isStatusTypeKeyAvailable(statusTypeKey);
        if (statusTypeKeyIsAvailable) {
            return statusTypeKey;
        }
    }
    const statusTypeKeyRoot = (statusTypeKey === ""
        ? (recordTypeKey + "-" +
            statusType
                .toLowerCase()
                .trim()
                .replace(/[^_a-z-]/g, "-"))
        : statusTypeKey).slice(0, 24);
    console.log("Check statusTypeKeyRoot = " + statusTypeKeyRoot);
    statusTypeKeyIsAvailable = isStatusTypeKeyAvailable(statusTypeKeyRoot);
    if (statusTypeKeyIsAvailable) {
        return statusTypeKeyRoot;
    }
    for (let counter = 0; counter <= 99999; counter += 1) {
        const statusTypeKey = statusTypeKeyRoot + "-" + ("0000" + counter.toString()).slice(-5);
        statusTypeKeyIsAvailable = isStatusTypeKeyAvailable(statusTypeKey);
        if (statusTypeKeyIsAvailable) {
            return statusTypeKey;
        }
    }
    return;
};
export const handler = async (request, response) => {
    statusTypes = await getAllStatusTypes();
    const statusTypeKey = generateStatusTypeKey(request.body.recordTypeKey, request.body.statusTypeKey, request.body.statusType);
    if (!statusTypeKey) {
        return response.json({
            success: false,
            message: "Unable to generate a unique status type key."
        });
    }
    const statusType = {
        statusTypeKey,
        recordTypeKey: request.body.recordTypeKey,
        statusType: request.body.statusType,
        isActive: true,
        orderNumber: 0
    };
    const success = await addStatusType(statusType);
    if (success) {
        cache.clearCache();
        const statusTypesReturn = await getAllStatusTypes();
        return response.json({
            success: true,
            statusTypes: statusTypesReturn
        });
    }
    else {
        return response.json({
            success: false,
            message: "An unknown error occurred."
        });
    }
};
export default handler;
