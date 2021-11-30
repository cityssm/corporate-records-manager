import { addRecordUser } from "../../helpers/recordsDB/addRecordUser.js";
export const handler = async (request, response) => {
    const recordUserID = await addRecordUser(request.body, request.session);
    return recordUserID
        ? response.json({
            success: true,
            recordUserID
        })
        : response.json({
            success: false,
            message: "An unknown error occurred.  Please try again."
        });
};
export default handler;
