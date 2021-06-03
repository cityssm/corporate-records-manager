import getRecordURLs from "../helpers/recordsDB/getRecordURLs.js";
export const handler = async (req, res) => {
    const recordID = req.body.recordID;
    const urls = await getRecordURLs(recordID);
    if (urls) {
        return res.json({
            success: true,
            urls
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
