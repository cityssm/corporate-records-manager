import * as cache from "../../helpers/recordsDB/configCache.js";
import { updateRecordType } from "../../helpers/recordsDB/updateRecordType.js";
export const handler = async (request, response) => {
    const recordType = {
        recordTypeKey: request.body.recordTypeKey,
        recordType: request.body.recordType,
        minlength: Number.parseInt(request.body.minlength, 10),
        maxlength: Number.parseInt(request.body.maxlength, 10),
        pattern: request.body.pattern,
        patternHelp: request.body.patternHelp
    };
    const success = await updateRecordType(recordType);
    cache.clearCache();
    return success
        ? response.json({
            success: true,
            recordType
        })
        : response.json({
            success: false,
            message: "An unknown error occurred."
        });
};
export default handler;
