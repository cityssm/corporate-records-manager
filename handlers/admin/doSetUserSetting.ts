import type { RequestHandler } from "express";

import { updateUserSetting } from "../../helpers/recordsDB/updateUserSetting.js";
import type { FieldName } from "../../helpers/recordsDB/updateUserSetting.js";


export const handler: RequestHandler = async (req, res) => {

  const userName: string = req.body.userName;
  const fieldName: FieldName = req.body.fieldName;

  if (!["isActive", "canUpdate", "isAdmin"].includes(fieldName)) {
    return res.json({
      success: false,
      message: "Unrecognized fieldName = " + fieldName
    });
  }

  const fieldValue: boolean = req.body.fieldValue;

  await updateUserSetting(userName, fieldName, fieldValue);

  return res.json({
    success: true,
    fieldValue: typeof (fieldValue)
  });

};


export default handler;
