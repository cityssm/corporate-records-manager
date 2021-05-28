import { Router } from "express";


import handler_reports from "../handlers/reports.js";


export const router = Router();


router.get("/", handler_reports);


export default router;
