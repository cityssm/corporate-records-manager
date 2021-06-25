import * as cache from "../../helpers/recordsDB/configCache.js";
import getAllStatusTypes from "../../helpers/recordsDB/getAllStatusTypes.js";
import addStatusType from "../../helpers/recordsDB/addStatusType.js";
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
                .replace(/[^a-z\-_]/g, "-"))
        : statusTypeKey)
        .substring(0, 24);
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
    return null;
};
export const handler = async (req, res) => {
    statusTypes = await getAllStatusTypes();
    const statusTypeKey = generateStatusTypeKey(req.body.recordTypeKey, req.body.statusTypeKey, req.body.statusType);
    if (!statusTypeKey) {
        return res.json({
            success: false,
            message: "Unable to generate a unique status type key."
        });
    }
    const statusType = {
        statusTypeKey,
        recordTypeKey: req.body.recordTypeKey,
        statusType: req.body.statusType,
        isActive: true,
        orderNumber: 0
    };
    const success = await addStatusType(statusType);
    if (success) {
        cache.clearCache();
        const statusTypesReturn = await getAllStatusTypes();
        return res.json({
            success: true,
            statusTypes: statusTypesReturn
        });
    }
    else {
        return res.json({
            success: false,
            message: "An unknown error occurred."
        });
    }
};
export default handler;
