import { Router } from "express";

import * as configFns from "../helpers/configFns.js";

import handler_edit from "../handlers/edit.js";
import handler_doUpdate from "../handlers/doUpdate.js";

import handler_doAddURL from "../handlers/doAddURL.js";
import handler_doUpdateURL from "../handlers/doUpdateURL.js";
import handler_doRemoveURL from "../handlers/doRemoveURL.js";

import handler_doSearchDocuShare from "../handlers/doSearchDocuShare.js";
import handler_doAddDocuShareURL from "../handlers/doAddDocuShareURL.js";


export const router = Router();


router.get("/", (_req, res) => {
  return res.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard");
});


router.post("/doUpdate", handler_doUpdate);


router.post("/doAddURL", handler_doAddURL);
router.post("/doUpdateURL", handler_doUpdateURL);
router.post("/doRemoveURL", handler_doRemoveURL);


if (configFns.getProperty("integrations.docuShare.isEnabled")) {
  router.post("/doSearchDocuShare", handler_doSearchDocuShare);
  router.post("/doAddDocuShareURL", handler_doAddDocuShareURL);
}


router.get("/:recordID", handler_edit);


export default router;
