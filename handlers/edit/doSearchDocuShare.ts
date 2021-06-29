import type { RequestHandler } from "express";

import * as configFns from "../../helpers/configFns.js";
import { searchDocuShare } from "../../helpers/docuShare/searchDocuShare.js";


export const handler: RequestHandler = async (request, response) => {

  const collectionHandleIndex = Number.parseInt(request.body.collectionHandleIndex, 10);

  const collectionHandle = configFns.getProperty("integrations.docuShare.collectionHandles")[collectionHandleIndex].handle;

  const dsObjects = await searchDocuShare(collectionHandle, request.body.searchString);

  return dsObjects
    ? response.json({
      success: true,
      dsObjects: dsObjects
    })
    : response.json({
      success: false,
      message: "An unknown error occurred.  Please try again."
    });
};


export default handler;
