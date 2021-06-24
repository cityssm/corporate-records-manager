import { getRecordType } from "../../helpers/recordsDB/configCache.js";
import * as configFns from "../../helpers/configFns.js";
export const handler = async (req, res) => {
    const recordTypeKey = req.params.recordTypeKey;
    const recordType = await getRecordType(recordTypeKey);
    if (!recordType || !recordType.isActive) {
        return res.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard?error=recordTypeKeyNotAvailable");
    }
    const emptyRecord = {
        recordID: null,
        recordTypeKey: recordTypeKey,
        recordNumber: "",
        recordDate: new Date(),
        recordTitle: "",
        recordDescription: "",
        tags: []
    };
    res.render("edit", {
        headTitle: "New " + recordType.recordType,
        isNew: true,
        recordType,
        record: emptyRecord,
        statusTypes: null
    });
};
export default handler;
