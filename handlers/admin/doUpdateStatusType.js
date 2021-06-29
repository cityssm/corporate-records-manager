import * as cache from "../../helpers/recordsDB/configCache.js";
import { getAllStatusTypes } from "../../helpers/recordsDB/getAllStatusTypes.js";
import { updateStatusType } from "../../helpers/recordsDB/updateStatusType.js";
export const handler = async (request, response) => {
    const statusType = {
        statusTypeKey: request.body.statusTypeKey,
        statusType: request.body.statusType
    };
    const success = await updateStatusType(statusType);
    cache.clearCache();
    if (success) {
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
