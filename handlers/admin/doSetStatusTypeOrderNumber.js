import setStatusTypeOrderNumber from "../../helpers/recordsDB/setStatusTypeOrderNumber.js";
import getAllStatusTypes from "../../helpers/recordsDB/getAllStatusTypes.js";
import { clearCache } from "../../helpers/recordsDB/configCache.js";
export const handler = async (req, res) => {
    const statusTypeKey = req.body.statusTypeKey;
    const orderNumber = req.body.orderNumber;
    await setStatusTypeOrderNumber(statusTypeKey, orderNumber, true);
    clearCache();
    const statusTypes = await getAllStatusTypes();
    return res.json({
        success: true,
        statusTypes
    });
};
export default handler;
