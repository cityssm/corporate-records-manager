import * as cache from "../../helpers/recordsDB/configCache.js";
import { updateRecordUserType } from "../../helpers/recordsDB/updateRecordUserType.js";
export const handler = async (request, response) => {
    const recordUserType = {
        recordUserTypeKey: request.body.recordUserTypeKey,
        recordUserType: request.body.recordUserType
    };
    const success = await updateRecordUserType(recordUserType);
    cache.clearCache();
    return success
        ? response.json({
            success: true,
            recordUserType
        })
        : response.json({
            success: false,
            message: "An unknown error occurred."
        });
};
export default handler;
