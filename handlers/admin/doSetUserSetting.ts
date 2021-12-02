import type { RequestHandler } from "express";

import { updateUserSetting } from "../../helpers/recordsDB/updateUserSetting.js";
import type { FieldName } from "../../helpers/recordsDB/updateUserSetting.js";


const userSettingFields = new Set(["isActive", "canViewAll", "canUpdate", "isAdmin"]);


export const handler: RequestHandler = async (request, response) => {

  const userName: string = request.body.userName;
  const fieldName: FieldName = request.body.fieldName;

  if (!userSettingFields.has(fieldName)) {
    return response.json({
      success: false,
      message: "Unrecognized fieldName = " + fieldName
    });
  }

  const fieldValue: boolean = request.body.fieldValue;

  await updateUserSetting(userName, fieldName, fieldValue);

  return response.json({
    success: true,
    fieldValue: typeof (fieldValue)
  });

};


export default handler;
