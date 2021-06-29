import { updateStatusTypeIsActive } from "../../helpers/recordsDB/updateStatusTypeIsActive.js";
import { clearCache } from "../../helpers/recordsDB/configCache.js";
export const handler = async (request, response) => {
    const statusTypeKey = request.body.statusTypeKey;
    const isActive = request.body.isActive;
    await updateStatusTypeIsActive(statusTypeKey, isActive);
    clearCache();
    return response.json({
        success: true
    });
};
export default handler;
