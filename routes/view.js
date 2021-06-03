import { Router } from "express";
import * as configFns from "../helpers/configFns.js";
import handler_view from "../handlers/view.js";
import handler_doGetURLs from "../handlers/doGetURLs.js";
export const router = Router();
router.get("/", (_req, res) => {
    return res.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard");
});
router.post("/doGetURLs", handler_doGetURLs);
router.get("/:recordID", handler_view);
export default router;
