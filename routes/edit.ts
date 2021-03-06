import { Router } from "express";

import * as configFns from "../helpers/configFns.js";

import { canViewAll as handler_canViewAll } from "../handlers/permissions.js";

import handler_edit from "../handlers/edit/edit.js";
import handler_doUpdate from "../handlers/edit/doUpdate.js";
import handler_doRemove from "../handlers/edit/doRemove.js";

import handler_doGetSuggestedTags from "../handlers/edit/doGetSuggestedTags.js";

import handler_doAddStatus from "../handlers/edit/doAddStatus.js";
import handler_doUpdateStatus from "../handlers/edit/doUpdateStatus.js";
import handler_doRemoveStatus from "../handlers/edit/doRemoveStatus.js";

import handler_doGetSuggestedRecordUsers from "../handlers/edit/doGetSuggestedRecordUsers.js";
import handler_doAddRecordUser from "../handlers/edit/doAddRecordUser.js";
import handler_doRemoveRecordUser from "../handlers/edit/doRemoveRecordUser.js";

import handler_doAddURL from "../handlers/edit/doAddURL.js";
import handler_doUpdateURL from "../handlers/edit/doUpdateURL.js";
import handler_doRemoveURL from "../handlers/edit/doRemoveURL.js";

import handler_doAddComment from "../handlers/edit/doAddComment.js";
import handler_doUpdateComment from "../handlers/edit/doUpdateComment.js";
import handler_doRemoveComment from "../handlers/edit/doRemoveComment.js";

import handler_doSearchDocuShare from "../handlers/edit/doSearchDocuShare.js";
import handler_doAddDocuShareURL from "../handlers/edit/doAddDocuShareURL.js";

import handler_doSearchRelatedRecords from "../handlers/edit/doSearchRelatedRecords.js";
import handler_doAddRelatedRecord from "../handlers/edit/doAddRelatedRecord.js";
import handler_doRemoveRelatedRecord from "../handlers/edit/doRemoveRelatedRecord.js";


export const router = Router();


router.get("/", (_request, response) => {
  return response.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard");
});


router.post("/doUpdate", handler_doUpdate);
router.post("/doRemove", handler_doRemove);


router.post("/doGetSuggestedTags", handler_doGetSuggestedTags);


router.post("/doAddStatus", handler_doAddStatus);
router.post("/doUpdateStatus", handler_doUpdateStatus);
router.post("/doRemoveStatus", handler_doRemoveStatus);


router.post("/doGetSuggestedRecordUsers", handler_doGetSuggestedRecordUsers);
router.post("/doAddRecordUser", handler_canViewAll, handler_doAddRecordUser);
router.post("/doRemoveRecordUser", handler_canViewAll, handler_doRemoveRecordUser);


router.post("/doAddURL", handler_doAddURL);
router.post("/doUpdateURL", handler_doUpdateURL);
router.post("/doRemoveURL", handler_doRemoveURL);


if (configFns.getProperty("integrations.docuShare.isEnabled")) {
  router.post("/doSearchDocuShare", handler_doSearchDocuShare);
  router.post("/doAddDocuShareURL", handler_doAddDocuShareURL);
}


router.post("/doSearchRelatedRecords", handler_doSearchRelatedRecords);
router.post("/doAddRelatedRecord", handler_doAddRelatedRecord);
router.post("/doRemoveRelatedRecord", handler_doRemoveRelatedRecord);


router.post("/doAddComment", handler_doAddComment);
router.post("/doUpdateComment", handler_doUpdateComment);
router.post("/doRemoveComment", handler_doRemoveComment);


router.get("/:recordID", handler_edit);


export default router;
