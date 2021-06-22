import getUser from "../../helpers/recordsDB/getUser.js";
import addUser from "../../helpers/recordsDB/addUser.js";
export const handler = async (req, res) => {
    const userName = req.body.userName;
    const existingUser = await getUser(userName, false);
    if (existingUser) {
        return res.json({
            success: false,
            message: "A user already exists with the same user name."
        });
    }
    const newUser = await addUser(userName);
    if (newUser) {
        return res.json({
            success: true,
            user: newUser
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
