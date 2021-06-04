import addStatus from "../helpers/recordsDB/addStatus.js";
export const handler = async (req, res) => {
    const successLogID = await addStatus(req.body, req.session);
    if (successLogID) {
        return res.json({
            success: true,
            successLogID
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
