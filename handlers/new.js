import { getRecordType } from "../helpers/recordsDB/configCache.js";
import * as configFns from "../helpers/configFns.js";
export const handler = async (req, res) => {
    const recordTypeKey = req.params.recordTypeKey;
    const recordType = await getRecordType(recordTypeKey);
    if (!recordType) {
        return res.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard?error=recordTypeKeyNotAvailable");
    }
    res.render("edit", {
        recordType,
        isNew: true
    });
};
export default handler;
