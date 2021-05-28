import { Router } from "express";
import * as configFns from "../helpers/configFns.js";
import handler_new from "../handlers/new.js";
export const router = Router();
router.get("/", (_req, res) => {
    return res.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard");
});
router.get("/:recordTypeKey", handler_new);
export default router;
