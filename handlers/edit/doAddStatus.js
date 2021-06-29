import { addStatus } from "../../helpers/recordsDB/addStatus.js";
export const handler = async (request, response) => {
    const successLogID = await addStatus(request.body, request.session);
    return successLogID
        ? response.json({
            success: true,
            successLogID
        })
        : response.json({
            success: false,
            message: "An unknown error occurred.  Please try again."
        });
};
export default handler;
