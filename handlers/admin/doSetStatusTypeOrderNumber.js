import { setStatusTypeOrderNumber } from "../../helpers/recordsDB/setStatusTypeOrderNumber.js";
import { getAllStatusTypes } from "../../helpers/recordsDB/getAllStatusTypes.js";
import { clearCache } from "../../helpers/recordsDB/configCache.js";
export const handler = async (request, response) => {
    const statusTypeKey = request.body.statusTypeKey;
    const orderNumber = request.body.orderNumber;
    await setStatusTypeOrderNumber(statusTypeKey, orderNumber, true);
    clearCache();
    const statusTypes = await getAllStatusTypes();
    return response.json({
        success: true,
        statusTypes
    });
};
export default handler;
