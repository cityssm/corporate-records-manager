import { addComment } from "../../helpers/recordsDB/addComment.js";
export const handler = async (request, response) => {
    const commentLogID = await addComment(request.body, request.session);
    return commentLogID
        ? response.json({
            success: true,
            commentLogID
        })
        : response.json({
            success: false,
            message: "An unknown error occurred.  Please try again."
        });
};
export default handler;
