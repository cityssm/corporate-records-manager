import { getRecordComments } from "../../helpers/recordsDB/getRecordComments.js";
export const handler = async (request, response) => {
    const recordID = request.body.recordID;
    const comments = await getRecordComments(recordID);
    return comments
        ? response.json({
            success: true,
            comments
        })
        : response.json({
            success: false,
            message: "An unknown error occurred.  Please try again."
        });
};
export default handler;
