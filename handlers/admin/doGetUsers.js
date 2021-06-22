import getUsers from "../../helpers/recordsDB/getUsers.js";
export const handler = async (_req, res) => {
    const users = await getUsers();
    return res.json({
        success: true,
        users
    });
};
export default handler;
