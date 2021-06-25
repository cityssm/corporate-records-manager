import { Router } from "express";


import handler_admin from "../handlers/admin/admin.js";

import handler_doGetUsers from "../handlers/admin/doGetUsers.js";
import handler_doAddUser from "../handlers/admin/doAddUser.js";
import handler_doSetUserSetting from "../handlers/admin/doSetUserSetting.js";
import handler_doRemoveUser from "../handlers/admin/doRemoveUser.js";

import handler_doGetRecordTypes from "../handlers/admin/doGetRecordTypes.js";
import handler_doAddRecordType from "../handlers/admin/doAddRecordType.js";
import handler_doUpdateRecordType from "../handlers/admin/doUpdateRecordType.js";
import handler_doSetRecordTypeIsActive from "../handlers/admin/doSetRecordTypeIsActive.js";
import handler_doRemoveRecordType from "../handlers/admin/doRemoveRecordType.js";

import handler_doGetStatusTypes from "../handlers/admin/doGetStatusTypes.js";
import handler_doAddStatusType from "../handlers/admin/doAddStatusType.js";
import handler_doUpdateStatusType from "../handlers/admin/doUpdateStatusType.js";
import handler_doSetStatusTypeIsActive from "../handlers/admin/doSetStatusTypeIsActive.js";
import handler_doSetStatusTypeOrderNumber from "../handlers/admin/doSetStatusTypeOrderNumber.js";
import handler_doRemoveStatusType from "../handlers/admin/doRemoveStatusType.js";


export const router = Router();


router.get("/", handler_admin);


router.post("/doGetUsers", handler_doGetUsers);
router.post("/doAddUser", handler_doAddUser);
router.post("/doSetUserSetting", handler_doSetUserSetting);
router.post("/doRemoveUser", handler_doRemoveUser);

router.post("/doGetRecordTypes", handler_doGetRecordTypes);
router.post("/doAddRecordType", handler_doAddRecordType);
router.post("/doUpdateRecordType", handler_doUpdateRecordType);
router.post("/doSetRecordTypeIsActive", handler_doSetRecordTypeIsActive);
router.post("/doRemoveRecordType", handler_doRemoveRecordType);

router.post("/doGetStatusTypes", handler_doGetStatusTypes);
router.post("/doAddStatusType", handler_doAddStatusType);
router.post("/doUpdateStatusType", handler_doUpdateStatusType);
router.post("/doSetStatusTypeIsActive", handler_doSetStatusTypeIsActive);
router.post("/doSetStatusTypeOrderNumber", handler_doSetStatusTypeOrderNumber);
router.post("/doRemoveStatusType", handler_doRemoveStatusType);


export default router;
