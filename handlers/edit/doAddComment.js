import addComment from "../../helpers/recordsDB/addComment.js";
export const handler = async (req, res) => {
    const commentLogID = await addComment(req.body, req.session);
    if (commentLogID) {
        return res.json({
            success: true,
            commentLogID
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
