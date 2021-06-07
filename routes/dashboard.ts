import { Router } from "express";


import handler_dashboard from "../handlers/dashboard.js";

import handler_doGetRecords from "../handlers/doGetRecords.js";


export const router = Router();


router.get("/", handler_dashboard);


router.post("/doGetRecords", handler_doGetRecords);


export default router;
