import { Router } from "express";


import handler_dashboard from "../handlers/dashboard/dashboard.js";

import handler_doGetRecords from "../handlers/dashboard/doGetRecords.js";
import handler_doGetRecordTagsForSearch from "../handlers/dashboard/doGetRecordTagsForSearch.js";
import handler_doGetStatusTypes from "../handlers/dashboard/doGetStatusTypes.js";


export const router = Router();


router.get("/", handler_dashboard);


router.post("/doGetRecords", handler_doGetRecords);
router.post("/doGetRecordTagsForSearch", handler_doGetRecordTagsForSearch);
router.post("/doGetStatusTypes", handler_doGetStatusTypes);


export default router;
