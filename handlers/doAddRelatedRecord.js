import addRelatedRecord from "../helpers/recordsDB/addRelatedRecord.js";
export const handler = async (req, res) => {
    const recordID = req.body.recordID;
    const relatedRecordID = req.body.relatedRecordID;
    await addRelatedRecord(recordID, relatedRecordID);
    return res.json({
        success: true
    });
};
export default handler;
