import { updateRecordUserTypeIsActive } from "../../helpers/recordsDB/updateRecordUserTypeIsActive.js";
import { clearCache } from "../../helpers/recordsDB/configCache.js";
export const handler = async (request, response) => {
    const recordUserTypeKey = request.body.recordUserTypeKey;
    const isActive = request.body.isActive;
    await updateRecordUserTypeIsActive(recordUserTypeKey, isActive);
    clearCache();
    return response.json({
        success: true
    });
};
export default handler;
