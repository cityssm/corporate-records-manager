import { updateUserSetting } from "../../helpers/recordsDB/updateUserSetting.js";
const userSettingFields = new Set(["isActive", "canUpdate", "isAdmin"]);
export const handler = async (request, response) => {
    const userName = request.body.userName;
    const fieldName = request.body.fieldName;
    if (!userSettingFields.has(fieldName)) {
        return response.json({
            success: false,
            message: "Unrecognized fieldName = " + fieldName
        });
    }
    const fieldValue = request.body.fieldValue;
    await updateUserSetting(userName, fieldName, fieldValue);
    return response.json({
        success: true,
        fieldValue: typeof (fieldValue)
    });
};
export default handler;
