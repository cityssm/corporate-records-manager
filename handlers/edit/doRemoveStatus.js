import { removeStatus } from "../../helpers/recordsDB/removeStatus.js";
export const handler = async (request, response) => {
    const success = await removeStatus(request.body.statusLogID, request.session);
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
