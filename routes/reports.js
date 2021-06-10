import { Router } from "express";
import handler_reports from "../handlers/reports.js";
import handler_reportName from "../handlers/reportName.js";
export const router = Router();
router.get("/", handler_reports);
router.get("/:reportName", handler_reportName);
export default router;
