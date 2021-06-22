import addURL from "../../helpers/recordsDB/addURL.js";
export const handler = async (req, res) => {
    const success = await addURL(req.body, req.session);
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
