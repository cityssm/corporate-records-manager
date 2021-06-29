import { getUsers } from "../../helpers/recordsDB/getUsers.js";
export const handler = async (_request, response) => {
    const users = await getUsers();
    return response.json({
        success: true,
        users
    });
};
export default handler;
