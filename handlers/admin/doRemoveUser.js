import removeUser from "../../helpers/recordsDB/removeUser.js";
export const handler = async (req, res) => {
    const userName = req.body.userName;
    if (userName === req.session.user.userName) {
        return res.json({
            success: false,
            message: "You cannot remove your own user."
        });
    }
    const success = await removeUser(userName);
    if (success) {
        return res.json({
            success: true
        });
    }
    else {
        return res.json({
            success: false,
            message: "An unknown error occurred."
        });
    }
};
export default handler;
