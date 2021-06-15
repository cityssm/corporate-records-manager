import { Router } from "express";

import * as configFns from "../helpers/configFns.js";

import handler_edit from "../handlers/edit.js";
import handler_doUpdate from "../handlers/doUpdate.js";

import handler_doGetSuggestedTags from "../handlers/doGetSuggestedTags.js";

import handler_doAddStatus from "../handlers/doAddStatus.js";
import handler_doUpdateStatus from "../handlers/doUpdateStatus.js";
import handler_doRemoveStatus from "../handlers/doRemoveStatus.js";

import handler_doAddURL from "../handlers/doAddURL.js";
import handler_doUpdateURL from "../handlers/doUpdateURL.js";
import handler_doRemoveURL from "../handlers/doRemoveURL.js";

import handler_doAddComment from "../handlers/doAddComment.js";
import handler_doUpdateComment from "../handlers/doUpdateComment.js";
import handler_doRemoveComment from "../handlers/doRemoveComment.js";

import handler_doSearchDocuShare from "../handlers/doSearchDocuShare.js";
import handler_doAddDocuShareURL from "../handlers/doAddDocuShareURL.js";

import handler_doSearchRelatedRecords from "../handlers/doSearchRelatedRecords.js";
import handler_doAddRelatedRecord from "../handlers/doAddRelatedRecord.js";
import handler_doRemoveRelatedRecord from "../handlers/doRemoveRelatedRecord.js";


export const router = Router();


router.get("/", (_req, res) => {
  return res.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard");
});


router.post("/doUpdate", handler_doUpdate);


router.post("/doGetSuggestedTags", handler_doGetSuggestedTags);


router.post("/doAddStatus", handler_doAddStatus);
router.post("/doUpdateStatus", handler_doUpdateStatus);
router.post("/doRemoveStatus", handler_doRemoveStatus);


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
