import { getRecordType } from "../helpers/recordsDB/configCache.js";
import getRecord from "../helpers/recordsDB/getRecord.js";
import * as configFns from "../helpers/configFns.js";
export const handler = async (req, res) => {
    const recordID = req.params.recordID;
    const record = await getRecord(recordID);
    if (!record) {
        return res.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard?error=recordNotAvailable");
    }
    const recordType = await getRecordType(record.recordTypeKey);
    if (!recordType) {
        return res.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard?error=recordTypeKeyNotAvailable");
    }
    res.render("view", {
        recordType,
        record
    });
};
export default handler;
