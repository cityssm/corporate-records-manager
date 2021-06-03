import * as ds from "@cityssm/docushare";
import * as docuShareFns from "../helpers/docuShareFns.js";
import addURL from "../helpers/recordsDB/addURL.js";
docuShareFns.doSetup();
export const handler = async (req, res) => {
    const handle = req.body.handle;
    const dsOutput = await ds.findByHandle(handle);
    if (!dsOutput.success) {
        return res.json({
            success: false,
            message: dsOutput.error
        });
    }
    if (dsOutput.dsObjects.length === 0) {
        return res.json({
            success: false,
            message: "Handle not found in DocuShare."
        });
    }
    const dsObject = dsOutput.dsObjects[0];
    const recordID = req.body.recordID;
    const urlID = await addURL({
        recordID,
        url: docuShareFns.getURL(dsObject.handle),
        urlTitle: dsObject.title,
        urlDescription: dsObject.summary
    }, req.session);
    return res.json({
        success: true,
        urlID
    });
};
export default handler;
