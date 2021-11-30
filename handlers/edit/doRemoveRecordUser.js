import { removeRecordUser } from "../../helpers/recordsDB/removeRecordUser.js";
export const handler = async (request, response) => {
    const success = await removeRecordUser(request.body.recordUserID, request.session);
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
