import { updateURL } from "../../helpers/recordsDB/updateURL.js";
export const handler = async (request, response) => {
    const success = await updateURL(request.body, request.session);
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
