import type { RequestHandler } from "express";

import { getRecordTypes } from "../helpers/recordsDB/configCache.js";


export const handler: RequestHandler = async (_req, res) => {

  const recordTypes = await getRecordTypes();

  res.render("dashboard", {
    headTitle: "Dashboard",
    recordTypes
  });
};


export default handler;
