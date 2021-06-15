import { getRecordTypes } from "../helpers/recordsDB/configCache.js";
export const handler = async (_req, res) => {
    const recordTypes = await getRecordTypes();
    res.render("dashboard", {
        headTitle: "Dashboard",
        recordTypes
    });
};
export default handler;
