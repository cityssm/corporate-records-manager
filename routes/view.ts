import { Router } from "express";

import * as configFns from "../helpers/configFns.js";

import handler_view from "../handlers/view/view.js";
import handler_doGetStatuses from "../handlers/view/doGetStatuses.js";
import handler_doGetURLs from "../handlers/view/doGetURLs.js";
import handler_doGetRelatedRecords from "../handlers/view/doGetRelatedRecords.js";
import handler_doGetComments from "../handlers/view/doGetComments.js";


export const router = Router();


router.get("/", (_request, response) => {
  return response.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard");
});

router.post("/doGetStatuses", handler_doGetStatuses);
router.post("/doGetURLs", handler_doGetURLs);
router.post("/doGetRelatedRecords", handler_doGetRelatedRecords);
router.post("/doGetComments", handler_doGetComments);

router.get("/:recordID", handler_view);


export default router;
