import * as cache from "../../helpers/recordsDB/configCache.js";
import removeRecordType from "../../helpers/recordsDB/removeRecordType.js";
export const handler = async (req, res) => {
    const success = await removeRecordType(req.body.recordTypeKey);
    if (success) {
        cache.clearCache();
        return res.json({
            success: true
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
