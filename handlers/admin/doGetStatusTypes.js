import getAllStatusTypes from "../../helpers/recordsDB/getAllStatusTypes.js";
export const handler = async (_req, res) => {
    const statusTypes = await getAllStatusTypes();
    return res.json({
        success: true,
        statusTypes
    });
};
export default handler;
