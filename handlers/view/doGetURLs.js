import { getRecordURLs } from "../../helpers/recordsDB/getRecordURLs.js";
export const handler = async (request, response) => {
    const recordID = request.body.recordID;
    const urls = await getRecordURLs(recordID);
    return urls
        ? response.json({
            success: true,
            urls
        })
        : response.json({
            success: false,
            message: "An unknown error occurred.  Please try again."
        });
};
export default handler;
