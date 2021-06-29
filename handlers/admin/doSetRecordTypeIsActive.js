import { updateRecordTypeIsActive } from "../../helpers/recordsDB/updateRecordTypeIsActive.js";
import { clearCache } from "../../helpers/recordsDB/configCache.js";
export const handler = async (request, response) => {
    const recordTypeKey = request.body.recordTypeKey;
    const isActive = request.body.isActive;
    await updateRecordTypeIsActive(recordTypeKey, isActive);
    clearCache();
    return response.json({
        success: true
    });
};
export default handler;
