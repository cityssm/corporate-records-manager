import getSuggestedRecordTags from "../helpers/recordsDB/getSuggestedRecordTags.js";
export const handler = async (req, res) => {
    const recordID = req.body.recordID;
    const tags = await getSuggestedRecordTags(recordID, req.body.searchString);
    if (tags) {
        return res.json({
            success: true,
            tags
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
