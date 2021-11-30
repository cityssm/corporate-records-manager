import { getRecordUsers } from "../../helpers/recordsDB/getRecordUsers.js";
export const handler = async (request, response) => {
    const recordID = request.body.recordID;
    const recordUsers = await getRecordUsers(recordID);
    return recordUsers
        ? response.json({
            success: true,
            recordUsers
        })
        : response.json({
            success: false,
            message: "An unknown error occurred.  Please try again."
        });
};
export default handler;
