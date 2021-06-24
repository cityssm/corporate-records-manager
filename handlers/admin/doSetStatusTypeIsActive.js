import updateStatusTypeIsActive from "../../helpers/recordsDB/updateStatusTypeIsActive.js";
import { clearCache } from "../../helpers/recordsDB/configCache.js";
export const handler = async (req, res) => {
    const statusTypeKey = req.body.statusTypeKey;
    const isActive = req.body.isActive;
    await updateStatusTypeIsActive(statusTypeKey, isActive);
    clearCache();
    return res.json({
        success: true
    });
};
export default handler;
