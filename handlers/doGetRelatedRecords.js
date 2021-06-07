import getRelatedRecords from "../helpers/recordsDB/getRelatedRecords.js";
export const handler = async (req, res) => {
    const recordID = req.body.recordID;
    const relatedRecords = await getRelatedRecords(recordID);
    if (relatedRecords) {
        return res.json({
            success: true,
            relatedRecords
        });
    }
    else {
        return res.json({
            success: false,
            message: "An unknown error occurred.  Please try again."
        });
    }
};
export default handler;
