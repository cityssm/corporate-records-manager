import * as configCache from "../helpers/recordsDB/configCache.js";
import getRecord from "../helpers/recordsDB/getRecord.js";
import * as configFns from "../helpers/configFns.js";
export const handler = async (req, res) => {
    const recordID = req.params.recordID;
    const record = await getRecord(recordID);
    if (!record) {
        return res.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard?error=recordNotAvailable");
    }
    const recordType = await configCache.getRecordType(record.recordTypeKey);
    if (!recordType) {
        return res.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard?error=recordTypeKeyNotAvailable");
    }
    const statusTypes = await configCache.getStatusTypes(record.recordTypeKey);
    res.render(req.query.view === "print" ? "print" : "view", {
        recordType,
        record,
        statusTypes
    });
};
export default handler;
