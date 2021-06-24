import { updateRecordTypeIsActive } from "../../helpers/recordsDB/updateRecordTypeIsActive.js";
import { clearCache } from "../../helpers/recordsDB/configCache.js";
export const handler = async (req, res) => {
    const recordTypeKey = req.body.recordTypeKey;
    const isActive = req.body.isActive;
    await updateRecordTypeIsActive(recordTypeKey, isActive);
    clearCache();
    return res.json({
        success: true
    });
};
export default handler;
