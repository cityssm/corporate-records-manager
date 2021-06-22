import { updateUserSetting } from "../../helpers/recordsDB/updateUserSetting.js";
export const handler = async (req, res) => {
    const userName = req.body.userName;
    const fieldName = req.body.fieldName;
    if (!["isActive", "canUpdate", "isAdmin"].includes(fieldName)) {
        return res.json({
            success: false,
            message: "Unrecognized fieldName = " + fieldName
        });
    }
    const fieldValue = req.body.fieldValue;
    await updateUserSetting(userName, fieldName, fieldValue);
    return res.json({
        success: true,
        fieldValue: typeof (fieldValue)
    });
};
export default handler;
