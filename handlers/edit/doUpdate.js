import updateRecord from "../../helpers/recordsDB/updateRecord.js";
export const handler = async (req, res) => {
    const success = await updateRecord(req.body, req.session);
    if (success) {
        return res.json({
            success: true
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
