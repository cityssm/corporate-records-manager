import type { RequestHandler } from "express";
import type * as recordTypes from "../../types/recordTypes";

import { getRecordType } from "../../helpers/recordsDB/configCache.js";

import * as configFns from "../../helpers/configFns.js";


export const handler: RequestHandler = async (req, res) => {

  const recordTypeKey = req.params.recordTypeKey;

  const recordType = await getRecordType(recordTypeKey);

  if (!recordType) {
    return res.redirect(configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard?error=recordTypeKeyNotAvailable");
  }

  const emptyRecord: recordTypes.Record = {
    recordID: null,
    recordTypeKey: recordTypeKey,
    recordNumber: "",
    recordDate: new Date(),
    recordTitle: "",
    recordDescription: "",
    tags: []
  };

  res.render("edit", {
    headTitle: "New " + recordType.recordType,
    isNew: true,
    recordType,
    record: emptyRecord,
    statusTypes: null
  });
};


export default handler;
