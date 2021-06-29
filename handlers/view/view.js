import * as configCache from "../../helpers/recordsDB/configCache.js";
import { getRecord } from "../../helpers/recordsDB/getRecord.js";
import * as configFns from "../../helpers/configFns.js";
export const handler = async (request, response) => {
    const recordID = request.params.recordID;
    const record = await getRecord(recordID);
    if (!record) {
        return response.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard?error=recordNotAvailable");
    }
    const recordType = await configCache.getRecordType(record.recordTypeKey);
    if (!recordType) {
        return response.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard?error=recordTypeKeyNotAvailable");
    }
    const statusTypes = await configCache.getStatusTypes(record.recordTypeKey);
    response.render(request.query.view === "print" ? "print" : "view", {
        headTitle: recordType.recordType + " " + record.recordNumber,
        recordType,
        record,
        statusTypes
    });
};
export default handler;
