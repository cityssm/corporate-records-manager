import { Router } from "express";
import * as configFns from "../helpers/configFns.js";
import handler_edit from "../handlers/edit.js";
export const router = Router();
router.get("/", (_req, res) => {
    return res.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard");
});
router.get("/:recordID", handler_edit);
export default router;
