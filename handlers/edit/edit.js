import * as configCache from "../../helpers/recordsDB/configCache.js";
import { getRecord } from "../../helpers/recordsDB/getRecord.js";
import * as configFns from "../../helpers/configFns.js";
const urlPrefix = configFns.getProperty("reverseProxy.urlPrefix");
export const handler = async (request, response) => {
    const recordID = request.params.recordID;
    const record = await getRecord(recordID, request.session);
    if (!record) {
        return response.redirect(urlPrefix + "/dashboard?error=recordNotAvailable");
    }
    const recordType = await configCache.getRecordType(record.recordTypeKey);
    if (!recordType) {
        return response.redirect(urlPrefix + "/dashboard?error=recordTypeKeyNotAvailable");
    }
    const statusTypes = await configCache.getStatusTypes(record.recordTypeKey);
    const recordUserTypes = await configCache.getRecordUserTypes();
    response.render("edit", {
        headTitle: recordType.recordType + " " + record.recordNumber + " Update",
        isNew: false,
        recordType,
        record,
        statusTypes,
        recordUserTypes
    });
};
export default handler;
