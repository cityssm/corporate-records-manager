import { getRecordType } from "../../helpers/recordsDB/configCache.js";
import * as configFns from "../../helpers/configFns.js";
export const handler = async (request, response) => {
    const recordTypeKey = request.params.recordTypeKey;
    const recordType = await getRecordType(recordTypeKey);
    if (!recordType || !recordType.isActive) {
        return response.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard?error=recordTypeKeyNotAvailable");
    }
    const emptyRecord = {
        recordID: undefined,
        recordTypeKey: recordTypeKey,
        recordNumber: "",
        recordDate: new Date(),
        recordTitle: "",
        recordDescription: "",
        tags: []
    };
    response.render("edit", {
        headTitle: "New " + recordType.recordType,
        isNew: true,
        recordType,
        record: emptyRecord,
        statusTypes: undefined
    });
};
export default handler;
