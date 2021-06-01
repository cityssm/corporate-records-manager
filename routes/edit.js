import { Router } from "express";
import * as configFns from "../helpers/configFns.js";
import handler_edit from "../handlers/edit.js";
import handler_doUpdate from "../handlers/doUpdate.js";
export const router = Router();
router.get("/", (_req, res) => {
    return res.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard");
});
router.post("/doUpdate", handler_doUpdate);
router.get("/:recordID", handler_edit);
export default router;
