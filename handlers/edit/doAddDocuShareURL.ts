import type { RequestHandler } from "express";

import * as ds from "@cityssm/docushare";
import * as docuShareFns from "../../helpers/docuShareFns.js";
import { addURL } from "../../helpers/recordsDB/addURL.js";


docuShareFns.doSetup();


export const handler: RequestHandler = async (request, response) => {

  const handle = request.body.handle;

  const dsOutput = await ds.findByHandle(handle);

  if (!dsOutput.success) {
    return response.json({
      success: false,
      message: dsOutput.error
    });
  }

  if (dsOutput.dsObjects.length === 0) {
    return response.json({
      success: false,
      message: "Handle not found in DocuShare."
    });
  }

  const dsObject = dsOutput.dsObjects[0];

  const recordID = request.body.recordID;

  const urlID = await addURL({
    recordID,
    url: docuShareFns.getURL(dsObject.handle),
    urlTitle: dsObject.title,
    urlDescription: dsObject.summary
  }, request.session);

  return response.json({
    success: true,
    urlID
  });
};


export default handler;
