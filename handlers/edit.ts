import type { RequestHandler } from "express";

import { getRecordType } from "../helpers/recordsDB/configCache.js";
import getRecord from "../helpers/recordsDB/getRecord.js";

import * as configFns from "../helpers/configFns.js";


export const handler: RequestHandler = async (req, res) => {

  const recordID = req.params.recordID;

  const record = await getRecord(recordID);

  if (!record) {
    return res.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard?error=recordNotAvailable");
  }

  const recordType = await getRecordType(record.recordTypeKey);

  if (!recordType) {
    return res.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard?error=recordTypeKeyNotAvailable");
  }

  res.render("edit", {
    isNew: false,
    recordType,
    record
  });
};


export default handler;
