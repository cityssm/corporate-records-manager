import createRecord from "../helpers/recordsDB/createRecord.js";
export const handler = async (req, res) => {
    const recordID = await createRecord(req.body, req.session);
    if (recordID) {
        return res.json({
            success: true,
            recordID
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
