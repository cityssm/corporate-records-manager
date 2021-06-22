import { Router } from "express";


import handler_admin from "../handlers/admin/admin.js";

import handler_doGetUsers from "../handlers/admin/doGetUsers.js";
import handler_doAddUser from "../handlers/admin/doAddUser.js";
import handler_doSetUserSetting from "../handlers/admin/doSetUserSetting.js";
import handler_doRemoveUser from "../handlers/admin/doRemoveUser.js";


export const router = Router();


router.get("/", handler_admin);

router.post("/doGetUsers", handler_doGetUsers);
router.post("/doAddUser", handler_doAddUser);
router.post("/doSetUserSetting", handler_doSetUserSetting);
router.post("/doRemoveUser", handler_doRemoveUser);


export default router;
