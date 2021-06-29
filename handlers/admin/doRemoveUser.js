import { removeUser } from "../../helpers/recordsDB/removeUser.js";
export const handler = async (request, response) => {
    const userName = request.body.userName;
    if (userName === request.session.user.userName) {
        return response.json({
            success: false,
            message: "You cannot remove your own user."
        });
    }
    const success = await removeUser(userName);
    return success
        ? response.json({
            success: true
        })
        : response.json({
            success: false,
            message: "An unknown error occurred."
        });
};
export default handler;
