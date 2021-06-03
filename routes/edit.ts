import { Router } from "express";

import * as configFns from "../helpers/configFns.js";

import handler_edit from "../handlers/edit.js";
import handler_doUpdate from "../handlers/doUpdate.js";

import handler_doSearchDocuShare from "../handlers/doSearchDocuShare.js";
import handler_doAddDocuShareLink from "../handlers/doAddDocuShareLink.js";


export const router = Router();


router.get("/", (_req, res) => {
  return res.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard");
});


router.post("/doUpdate", handler_doUpdate);


if (configFns.getProperty("integrations.docuShare.isEnabled")) {

  router.post("/doSearchDocuShare", handler_doSearchDocuShare);

  router.post("/doAddDocuShareLink", handler_doAddDocuShareLink);
}


router.get("/:recordID", handler_edit);


export default router;
