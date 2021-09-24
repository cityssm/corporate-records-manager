import { getRecordTagsForSearch } from "../../helpers/recordsDB/getRecordTagsForSearch.js";
export const handler = async (_request, response) => {
    const tags = await getRecordTagsForSearch();
    return response.json({
        tags
    });
};
export default handler;
