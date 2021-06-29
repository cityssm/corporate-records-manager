import { createRecord } from "../../helpers/recordsDB/createRecord.js";
export const handler = async (request, response) => {
    const recordID = await createRecord(request.body, request.session);
    return recordID
        ? response.json({
            success: true,
            recordID
        })
        : response.json({
            success: false,
            message: "An unknown error occurred.  Please try again."
        });
};
export default handler;
