import * as ds from "@cityssm/docushare";

import * as docuShareFns from "../docuShareFns.js";
import type * as docuShareTypes from "@cityssm/docushare/types";

import debug from "debug";
const debugDS = debug("corporate-records-manager:docuShare:searchDocuShare");


export const searchDocuShare = async (parentCollectionHandle: string, searchString: string): Promise<docuShareTypes.DocuShareObject[]> => {

  const result = await ds.findChildren(parentCollectionHandle, {
    title: {
      searchType: "includesPieces",
      searchString: searchString
    }
  });

  if (result.error) {
    debugDS(result.error);
  }

  const dsObjects = result.dsObjects;

  for (const dsObject of dsObjects) {
    dsObject.url = docuShareFns.getURL(dsObject.handle);
  }

  return result.dsObjects;
};


export default searchDocuShare;
