import updateURL from "../helpers/recordsDB/updateURL.js";
export const handler = async (req, res) => {
    const success = await updateURL(req.body, req.session);
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
