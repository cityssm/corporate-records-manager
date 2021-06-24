import * as cache from "../../helpers/recordsDB/configCache.js";
import updateRecordType from "../../helpers/recordsDB/updateRecordType.js";
export const handler = async (req, res) => {
    const recordType = {
        recordTypeKey: req.body.recordTypeKey,
        recordType: req.body.recordType,
        minlength: parseInt(req.body.minlength, 10),
        maxlength: parseInt(req.body.maxlength, 10),
        pattern: req.body.pattern,
        patternHelp: req.body.patternHelp
    };
    const success = await updateRecordType(recordType);
    if (success) {
        cache.clearCache();
        return res.json({
            success: true,
            recordType
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
