import type { RequestHandler } from "express";

import * as configFns from "../../helpers/configFns.js";
import searchDocuShare from "../../helpers/docuShare/searchDocuShare.js";


export const handler: RequestHandler = async (req, res) => {

  const collectionHandleIndex = parseInt(req.body.collectionHandleIndex, 10);

  const collectionHandle = configFns.getProperty("integrations.docuShare.collectionHandles")[collectionHandleIndex].handle;

  const dsObjects = await searchDocuShare(collectionHandle, req.body.searchString);

  if (dsObjects) {
    return res.json({
      success: true,
      dsObjects: dsObjects
    });
  } else {
    return res.json({
      success: false,
      message: "An unknown error occurred.  Please try again."
    });
  }
};


export default handler;
