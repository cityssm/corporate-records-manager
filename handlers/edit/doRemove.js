import { removeRecord } from "../../helpers/recordsDB/removeRecord.js";
export const handler = async (request, response) => {
    const recordID = request.body.recordID;
    const success = await removeRecord(recordID, request.session);
    return success
        ? response.json({
            success: true
        })
        : response.json({
            success: false,
            message: "An unknown error occurred.  Please try again."
        });
};
export default handler;
