import { getRecordTypes } from "../../helpers/recordsDB/getRecordTypes.js";
export const handler = async (_request, response) => {
    const recordTypes = await getRecordTypes(true);
    return response.json({
        success: true,
        recordTypes
    });
};
export default handler;
