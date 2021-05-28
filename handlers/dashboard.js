import { getRecordTypes } from "../helpers/recordsDB/configCache.js";
export const handler = async (_req, res) => {
    const recordTypes = await getRecordTypes();
    res.render("dashboard", {
        recordTypes
    });
};
export default handler;
