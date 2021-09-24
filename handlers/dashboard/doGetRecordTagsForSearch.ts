import type { RequestHandler } from "express";

import { getRecordTagsForSearch } from "../../helpers/recordsDB/getRecordTagsForSearch.js";


export const handler: RequestHandler = async (_request, response) => {

  const tags = await getRecordTagsForSearch();

  return response.json({
    tags
  });
};


export default handler;
